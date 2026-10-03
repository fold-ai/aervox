// Authored fictional brand-film choreography. No detection, guidance, or ballistics logic.
// Compile: swiftc -module-cache-path /tmp/actprove-swift-cache scripts/render-intercept.swift -o /tmp/render-actprove-intercept-v2
// Run from the project root: /tmp/render-actprove-intercept-v2 [--frames-only]
import Foundation
import AVFoundation
import CoreGraphics
import CoreVideo
import CoreMedia
import ImageIO
import UniformTypeIdentifiers
import VideoToolbox

let frameWidth = 1920
let frameHeight = 1080
let fps: Int32 = 30
let duration = 18.0
let project = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let media = project.appendingPathComponent("public/media")
let output = media.appendingPathComponent("intercept-sequence-v2.mp4")
let posterTime = 10.0
let reviewDirectory = URL(fileURLWithPath: "/private/tmp/actprove-intercept-v2-review", isDirectory: true)
let colorSpace = CGColorSpace(name: CGColorSpace.sRGB)!
let bitmapInfo = CGBitmapInfo.byteOrder32Little.rawValue | CGImageAlphaInfo.premultipliedFirst.rawValue

enum RenderError: Error { case invalidImage(String), bitmap, writer(String), pixelBuffer }

func loadImage(_ filename: String) throws -> CGImage {
    let url = media.appendingPathComponent(filename)
    guard let source = CGImageSourceCreateWithURL(url as CFURL, nil),
          let image = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
        throw RenderError.invalidImage(filename)
    }
    return image
}

// Decode to a predictable RGBA layout and ignore nearly transparent generation specks.
func alphaBounds(_ image: CGImage) throws -> CGRect {
    let width = image.width, height = image.height
    var pixels = [UInt8](repeating: 0, count: width * height * 4)
    var x0 = width, y0 = height, x1 = 0, y1 = 0
    try pixels.withUnsafeMutableBytes { bytes in
        guard let context = CGContext(data: bytes.baseAddress, width: width, height: height,
              bitsPerComponent: 8, bytesPerRow: width * 4, space: colorSpace,
              bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue) else { throw RenderError.bitmap }
        context.draw(image, in: CGRect(x: 0, y: 0, width: width, height: height))
        let data = bytes.bindMemory(to: UInt8.self)
        for y in 0..<height {
            for x in 0..<width where data[(y * width + x) * 4 + 3] >= 8 {
                x0 = min(x0, x); x1 = max(x1, x)
                y0 = min(y0, y); y1 = max(y1, y)
            }
        }
    }
    guard x0 <= x1, y0 <= y1 else { throw RenderError.invalidImage("Drone has no visible alpha") }
    return CGRect(x: x0, y: y0, width: x1 - x0 + 1, height: y1 - y0 + 1)
}

let background = try loadImage("intercept-backdrop-v2.png")
let fullDrone = try loadImage("flight-drone.png")
let bounds = try alphaBounds(fullDrone)
guard let drone = fullDrone.cropping(to: bounds) else { throw RenderError.invalidImage("Drone alpha crop") }
print("Target source \(fullDrone.width)×\(fullDrone.height), alpha bounds \(bounds)")
let fullInterceptor = try loadImage("intercept-aircraft-v2.png")
let interceptorBounds = try alphaBounds(fullInterceptor)
guard let interceptor = fullInterceptor.cropping(to: interceptorBounds) else { throw RenderError.invalidImage("Interceptor alpha crop") }
print("Interceptor source \(fullInterceptor.width)×\(fullInterceptor.height), alpha bounds \(interceptorBounds)")

func clamp(_ value: Double, _ lo: Double = 0, _ hi: Double = 1) -> Double { min(hi, max(lo, value)) }
func smooth(_ value: Double) -> Double { let x = clamp(value); return x * x * (3 - 2 * x) }
func mix(_ a: Double, _ b: Double, _ t: Double) -> Double { a + (b - a) * t }
func ink(_ r: CGFloat, _ g: CGFloat, _ b: CGFloat, _ alpha: CGFloat = 1) -> CGColor {
    CGColor(colorSpace: colorSpace, components: [r, g, b, alpha])!
}

struct AircraftPose {
    let cx: Double
    let cy: Double
    let w: Double
    let rotation: Double
    let opacity: Double
}

let hiddenAircraft = AircraftPose(cx: 0, cy: 0, w: 0, rotation: 0, opacity: 0)
let contactTime = 12.20

func approach(at time: Double) -> AircraftPose {
    let p = clamp(time / 8.5), e = smooth(p), arc = sin(p * .pi)
    return AircraftPose(cx: mix(0.654, 0.636, e) + sin(time * 0.51) * 0.003 * arc,
                        cy: mix(0.291, 0.347, e) - sin(time * 0.43) * 0.003 * arc,
                        w: mix(0.015, 0.145, e), rotation: -4 + 5 * arc,
                        opacity: mix(0.64, 1, smooth(p * 1.8)))
}

// Fixed editorial choreography: both silhouettes dissolve into a brief contact transition.
func pose(at time: Double) -> AircraftPose {
    if time >= duration { return approach(at: 0) }
    if time < contactTime { return approach(at: time) }
    let locked = approach(at: 8.5)
    if time < 17 {
        return AircraftPose(cx: locked.cx, cy: locked.cy, w: locked.w, rotation: locked.rotation,
                            opacity: 1 - smooth((time - contactTime) / 0.28))
    }
    let first = approach(at: 0)
    return AircraftPose(cx: first.cx, cy: first.cy, w: first.w, rotation: first.rotation,
                        opacity: first.opacity * smooth((time - 17.0) / 1.0))
}

func interceptorPose(at time: Double) -> AircraftPose {
    guard time >= 8.45 && time < contactTime + 0.28 else { return hiddenAircraft }
    let p = clamp((time - 8.45) / (contactTime - 8.45))
    let fadeIn = smooth((time - 8.45) / 0.28)
    let fadeOut = 1 - smooth((time - contactTime) / 0.28)
    // A continuous, plainly visible foreground pass toward an authored final screen pose.
    return AircraftPose(cx: mix(0.800, 0.652, p), cy: mix(0.770, 0.373, p),
                        w: mix(0.215, 0.056, p), rotation: mix(-3, 9, smooth(p)),
                        opacity: fadeIn * fadeOut)
}

func phase(at time: Double) -> String {
    if time < 2.0 || time >= 17.0 { return "Distant" }
    if time < 4.5 { return "Acquiring" }
    if time < 8.45 { return "Locked" }
    if time < 12.5 { return "Intercept" }
    return "Complete"
}

func lockAlpha(at time: Double) -> Double {
    if time < 2 { return 0 }
    if time < 4.5 { return smooth((time - 2) / 1.15) * (0.72 + 0.28 * sin(time * 7.4)) }
    if time < contactTime { return 1 }
    return 1 - smooth((time - contactTime) / 0.28)
}

func drawAircraft(_ aircraft: AircraftPose, image: CGImage, context: CGContext) {
    guard aircraft.opacity > 0.001 else { return }
    let width = aircraft.w * Double(frameWidth)
    let height = width * Double(image.height) / Double(image.width)
    context.saveGState()
    context.setAlpha(aircraft.opacity)
    context.translateBy(x: aircraft.cx * Double(frameWidth), y: (1 - aircraft.cy) * Double(frameHeight))
    context.rotate(by: -aircraft.rotation * .pi / 180)
    context.interpolationQuality = .high
    context.draw(image, in: CGRect(x: -width / 2, y: -height / 2, width: width, height: height))
    context.restoreGState()
}

func drawBackground(time: Double, context: CGContext) {
    // Slow lens motion returns to its opening pose exactly at the loop boundary.
    let angle = time / duration * .pi * 2
    let scale = 1.055 + 0.030 * pow(sin(angle / 2), 2)
    let width = Double(frameWidth) * scale
    let height = width * Double(background.height) / Double(background.width)
    let x = (Double(frameWidth) - width) / 2 + sin(angle) * 22
    let y = (Double(frameHeight) - height) / 2 + (1 - cos(angle)) * 5
    context.interpolationQuality = .high
    context.draw(background, in: CGRect(x: x, y: y, width: width, height: height))
    // The photographic blue-hour exposure stays intact; no additional dark wash.
}

func softGlow(cx: Double, cy: Double, rx: Double, ry: Double, color: [CGFloat], alpha: Double, context: CGContext) {
    guard alpha > 0.001 else { return }
    context.saveGState()
    context.translateBy(x: cx, y: cy)
    context.scaleBy(x: rx, y: ry)
    let colors = [ink(color[0], color[1], color[2], alpha), ink(color[0], color[1], color[2], alpha * 0.34), ink(color[0], color[1], color[2], 0)] as CFArray
    let gradient = CGGradient(colorsSpace: colorSpace, colors: colors, locations: [0, 0.42, 1])!
    context.drawRadialGradient(gradient, startCenter: .zero, startRadius: 0, endCenter: .zero, endRadius: 1, options: [])
    context.restoreGState()
}

func drawContact(time: Double, context: CGContext) {
    let contactX = 0.636 * Double(frameWidth)
    let contactY = (1 - 0.347) * Double(frameHeight)
    let pulse = (time - (contactTime + 0.065)) / 0.12
    let brightness = exp(-pulse * pulse * 2.4)
    if brightness > 0.005 {
        context.saveGState(); context.setBlendMode(.screen)
        softGlow(cx: contactX, cy: contactY, rx: 60, ry: 43, color: [0.96, 0.84, 0.64], alpha: brightness * 0.70, context: context)
        softGlow(cx: contactX, cy: contactY, rx: 19, ry: 14, color: [1, 0.97, 0.88], alpha: brightness * 0.98, context: context)
        context.restoreGState()
    }
    // A soft photographic haze completes the transition; no projectile or debris imagery.
    if time > contactTime && time < 14.4 {
        let p = clamp((time - contactTime) / 2.2)
        softGlow(cx: contactX + p * 32, cy: contactY + p * 8, rx: 32 + p * 110, ry: 12 + p * 32,
                 color: [0.57, 0.60, 0.63], alpha: sin(p * .pi) * 0.12, context: context)
    }
}

func drawFrame(time: Double, context: CGContext) {
    drawBackground(time: time, context: context)
    drawAircraft(pose(at: time), image: drone, context: context)
    drawAircraft(interceptorPose(at: time), image: interceptor, context: context)
    drawContact(time: time, context: context)
}

func serializedPose(_ aircraft: AircraftPose, image: CGImage) -> [String: Any] {
    let height = aircraft.w * Double(frameWidth) * Double(image.height) / Double(image.width) / Double(frameHeight)
    return ["cx": aircraft.cx, "cy": aircraft.cy, "w": aircraft.w, "h": height,
            "rotation": aircraft.rotation, "opacity": aircraft.opacity]
}

func metadata(at time: Double) -> [String: Any] {
    var frame = serializedPose(pose(at: time), image: drone)
    frame["time"] = time
    frame["phase"] = phase(at: time)
    frame["lockAlpha"] = lockAlpha(at: time)
    frame["interceptor"] = serializedPose(interceptorPose(at: time), image: interceptor)
    return frame
}

func stillImage(at time: Double) throws -> CGImage {
    guard let context = CGContext(data: nil, width: frameWidth, height: frameHeight, bitsPerComponent: 8,
        bytesPerRow: frameWidth * 4, space: colorSpace, bitmapInfo: bitmapInfo) else { throw RenderError.bitmap }
    drawFrame(time: time, context: context)
    guard let result = context.makeImage() else { throw RenderError.bitmap }
    return result
}

func writePNG(_ image: CGImage, to url: URL) throws {
    guard let destination = CGImageDestinationCreateWithURL(url as CFURL, UTType.png.identifier as CFString, 1, nil) else { throw RenderError.bitmap }
    CGImageDestinationAddImage(destination, image, nil)
    guard CGImageDestinationFinalize(destination) else { throw RenderError.bitmap }
}

try FileManager.default.createDirectory(at: reviewDirectory, withIntermediateDirectories: true)
try writePNG(stillImage(at: posterTime), to: reviewDirectory.appendingPathComponent("poster.png"))
let compression = Process()
compression.executableURL = URL(fileURLWithPath: "/usr/bin/env")
compression.arguments = ["node", "-e", "require('sharp')('/private/tmp/actprove-intercept-v2-review/poster.png').webp({quality:90,effort:5}).toFile('public/media/intercept-poster-v2.webp').catch(e=>{console.error(e);process.exit(1)});"]
try compression.run(); compression.waitUntilExit()
guard compression.terminationStatus == 0 else { throw RenderError.bitmap }

let frames = (0...Int(duration * Double(fps))).map { metadata(at: Double($0) / Double(fps)) }
let track: [String: Any] = ["version": 2, "width": frameWidth, "height": frameHeight, "fps": fps, "duration": duration,
                          "posterTime": posterTime, "illustrative": true, "coordinates": "normalized-unrotated-alpha-bounds",
                          "rotationConvention": "clockwise-degrees", "frames": frames]
let trackData = try JSONSerialization.data(withJSONObject: track, options: [.sortedKeys])
try trackData.write(to: media.appendingPathComponent("intercept-track-v2.json"))
for time in [0.0, 2.5, 5.0, 8.0, 8.8, 9.5, 10.0, 10.8, 11.5, 12.15, 12.27, 12.5, 13.5, 17.5] {
    try writePNG(stillImage(at: time), to: reviewDirectory.appendingPathComponent("frame-\(time).png"))
}
print("Review frames: \(reviewDirectory.path)"); fflush(stdout)
if CommandLine.arguments.contains("--frames-only") { exit(0) }

if FileManager.default.fileExists(atPath: output.path) { try FileManager.default.removeItem(at: output) }
let writer = try AVAssetWriter(outputURL: output, fileType: .mp4)
writer.shouldOptimizeForNetworkUse = true
var settings: [String: Any] = [
    AVVideoCodecKey: AVVideoCodecType.h264,
    AVVideoWidthKey: frameWidth,
    AVVideoHeightKey: frameHeight,
    AVVideoColorPropertiesKey: [
        AVVideoColorPrimariesKey: AVVideoColorPrimaries_ITU_R_709_2,
        AVVideoTransferFunctionKey: AVVideoTransferFunction_ITU_R_709_2,
        AVVideoYCbCrMatrixKey: AVVideoYCbCrMatrix_ITU_R_709_2,
    ],
    AVVideoCompressionPropertiesKey: [
        AVVideoAverageBitRateKey: 8_000_000,
        AVVideoExpectedSourceFrameRateKey: fps,
        AVVideoMaxKeyFrameIntervalKey: 60,
        AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
        AVVideoAllowFrameReorderingKey: false,
    ],
]
if CommandLine.arguments.contains("--software") {
    settings[AVVideoEncoderSpecificationKey] = [kVTVideoEncoderSpecification_EnableHardwareAcceleratedVideoEncoder as String: false]
}
let input = AVAssetWriterInput(mediaType: .video, outputSettings: settings)
input.expectsMediaDataInRealTime = false
let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: [
    kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
    kCVPixelBufferWidthKey as String: frameWidth,
    kCVPixelBufferHeightKey as String: frameHeight,
    kCVPixelBufferCGImageCompatibilityKey as String: true,
    kCVPixelBufferCGBitmapContextCompatibilityKey as String: true,
])
guard writer.canAdd(input) else { throw RenderError.writer("Cannot add H.264 video track") }
writer.add(input)
guard writer.startWriting() else { throw RenderError.writer(String(describing: writer.error)) }
writer.startSession(atSourceTime: .zero)
let totalFrames = Int(duration * Double(fps))
for frame in 0..<totalFrames {
    while !input.isReadyForMoreMediaData {
        if writer.status == .failed { throw RenderError.writer(writer.error?.localizedDescription ?? "Encoder failed") }
        Thread.sleep(forTimeInterval: 0.003)
    }
    try autoreleasepool {
        var pixelBuffer: CVPixelBuffer?
        guard let pool = adaptor.pixelBufferPool,
              CVPixelBufferPoolCreatePixelBuffer(kCFAllocatorDefault, pool, &pixelBuffer) == kCVReturnSuccess,
              let buffer = pixelBuffer else { throw RenderError.pixelBuffer }
        CVPixelBufferLockBaseAddress(buffer, [])
        defer { CVPixelBufferUnlockBaseAddress(buffer, []) }
        guard let context = CGContext(data: CVPixelBufferGetBaseAddress(buffer), width: frameWidth,
              height: frameHeight, bitsPerComponent: 8, bytesPerRow: CVPixelBufferGetBytesPerRow(buffer),
              space: colorSpace, bitmapInfo: bitmapInfo) else { throw RenderError.bitmap }
        drawFrame(time: Double(frame) / Double(fps), context: context)
        let presentation = CMTime(value: Int64(frame), timescale: fps)
        guard adaptor.append(buffer, withPresentationTime: presentation) else {
            throw RenderError.writer(String(describing: writer.error))
        }
    }
    if frame % 60 == 0 { print("Encoded \(frame) / \(totalFrames)"); fflush(stdout) }
}
input.markAsFinished()
writer.endSession(atSourceTime: CMTime(seconds: duration, preferredTimescale: fps))
let finished = DispatchSemaphore(value: 0)
writer.finishWriting { finished.signal() }
finished.wait()
guard writer.status == .completed else { throw RenderError.writer(writer.error?.localizedDescription ?? "Finish failed") }
let size = try FileManager.default.attributesOfItem(atPath: output.path)[.size] as? NSNumber
print("Complete: \(output.path) — \(size?.intValue ?? 0) bytes, \(frameWidth)×\(frameHeight), \(fps) fps, \(duration)s, silent H.264")
