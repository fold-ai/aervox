// Authored fictional brand-film choreography. No detection, guidance, or ballistics logic.
// Compile: swiftc -module-cache-path /tmp/actprove-swift-cache scripts/render-intercept-v4.swift -o /tmp/render-actprove-intercept-v4
// Run from the project root: /tmp/render-actprove-intercept-v4 [--frames-only]
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
let duration = 14.0
let project = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let media = project.appendingPathComponent("public/media")
let output = media.appendingPathComponent("intercept-sequence-v4.mp4")
let posterTime = 8.0
let reviewDirectory = URL(fileURLWithPath: "/private/tmp/actprove-intercept-v4-review", isDirectory: true)
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

let background = try loadImage("intercept-backdrop-v3.png")
let fullDrone = try loadImage("intercept-target-v4.png")
let bounds = try alphaBounds(fullDrone)
guard let drone = fullDrone.cropping(to: bounds) else { throw RenderError.invalidImage("Drone alpha crop") }
print("Target source \(fullDrone.width)×\(fullDrone.height), alpha bounds \(bounds)")
let vapor = try loadImage("intercept-vapor-v3.png")

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

// Editorial keyframes only. This is a fictional film, not a guidance simulation.
let contactTime = 11.85
let widthKeys: [(Double, Double)] = [(0, 0.018), (2, 0.028), (4, 0.049), (6, 0.082), (8, 0.135), (9, 0.19), (10, 0.285), (11, 0.49), (11.5, 0.8), (11.85, 1.48)]
func approach(at time: Double) -> AircraftPose {
    let t = min(time, contactTime)
    var width = widthKeys.last!.1
    for i in 0..<(widthKeys.count - 1) {
        let a = widthKeys[i], b = widthKeys[i + 1]
        if t >= a.0 && t <= b.0 { width = mix(a.1, b.1, (t - a.0) / (b.0 - a.0)); break }
    }
    let bank = sin(t * 0.65) * 4.5 + sin(t * 1.2) * 1.0
    let settling = 1 - smooth(t / 5)
    return AircraftPose(cx: 0.697 + sin(t * 0.66) * 0.018 * settling,
                        cy: 0.335 + sin(t * 0.58) * 0.013,
                        w: width, rotation: bank, opacity: mix(0.67, 1, smooth(t / 5)))
}
func pose(at time: Double) -> AircraftPose {
    if time >= duration { return approach(at: 0) }
    if time < contactTime { return approach(at: time) }
    let first = approach(at: 0)
    return AircraftPose(cx: first.cx, cy: first.cy, w: first.w, rotation: first.rotation,
                        opacity: first.opacity * smooth((time - 12.7) / 1.3))
}
func phase(at time: Double) -> String {
    if time < 1.2 || time >= 12.7 { return "Distant" }
    if time < 3 { return "Acquiring" }
    if time < 8.7 { return "Locked" }
    if time < contactTime { return "Intercept" }
    return "Complete"
}
func lockAlpha(at time: Double) -> Double {
    if time < 1.2 || time >= contactTime { return 0 }
    if time < 3 { return smooth((time - 1.2) / 0.65) * (0.78 + 0.22 * sin(time * 8)) }
    return 1 - smooth((time - 10.7) / 0.85)
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
    let t = time >= 12.7 ? 0 : min(time, contactTime)
    let progress = t / contactTime
    let scale = 1.06 + progress * 0.32
    let width = Double(frameWidth) * scale
    let height = width * Double(background.height) / Double(background.width)
    context.saveGState()
    context.translateBy(x: Double(frameWidth) * 0.697, y: Double(frameHeight) * 0.665)
    context.rotate(by: sin(t * 0.6) * 0.014)
    context.interpolationQuality = .high
    context.draw(background, in: CGRect(x: -width * 0.697, y: -height * 0.665, width: width, height: height))
    context.restoreGState()
}

func drawVapor(time: Double, context: CGContext) {
    // Two authored depth planes pass outside the central sight line.
    for layer in 0..<2 {
        let p = (time / 5.5 + Double(layer) * 0.5).truncatingRemainder(dividingBy: 1)
        let scale = 0.8 + p * 1.8
        let w = Double(frameWidth) * scale
        let h = w * Double(vapor.height) / Double(vapor.width)
        context.saveGState()
        context.setAlpha(pow(sin(p * .pi), 2) * (layer == 0 ? 0.13 : 0.08))
        context.draw(vapor, in: CGRect(x: -w * (0.10 + p * 0.33), y: -h * (0.30 + p * 0.25), width: w, height: h))
        context.restoreGState()
    }
}

func drawFrame(time: Double, context: CGContext) {
    drawBackground(time: time, context: context)
    drawAircraft(pose(at: time), image: drone, context: context)
    drawVapor(time: time, context: context)
    if time >= contactTime && time < 12.7 {
        // Editorial impact transition for the fictional onboard camera. No weapon physics.
        let out = smooth((time - contactTime) / 0.20)
        context.setFillColor(ink(0.025, 0.036, 0.044, out * 0.95))
        context.fill(CGRect(x: 0, y: 0, width: frameWidth, height: frameHeight))
        let impact = time - contactTime
        if impact < 0.24 {
            let flash = (1 - smooth(impact / 0.24)) * 0.84
            let center = CGPoint(x: Double(frameWidth) * 0.697, y: Double(frameHeight) * 0.665)
            let colors = [ink(1, 0.94, 0.76, flash), ink(0.98, 0.55, 0.22, flash * 0.48), ink(0.2, 0.12, 0.08, 0)] as CFArray
            if let glow = CGGradient(colorsSpace: colorSpace, colors: colors, locations: [0, 0.25, 1]) {
                context.drawRadialGradient(glow, startCenter: center, startRadius: 0, endCenter: center,
                    endRadius: CGFloat(550 + impact * 2000), options: [.drawsBeforeStartLocation])
            }
        }
        context.setFillColor(ink(0.48, 0.56, 0.59, 0.024))
        for y in stride(from: 0, to: frameHeight, by: 4) {
            context.fill(CGRect(x: 0, y: y, width: frameWidth, height: 1))
        }
    } else if time >= 12.7 {
        context.setFillColor(ink(0.025, 0.036, 0.044, 0.95 * (1 - smooth((time - 12.7) / 1.3))))
        context.fill(CGRect(x: 0, y: 0, width: frameWidth, height: frameHeight))
    }
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
compression.arguments = ["node", "-e", "require('sharp')('/private/tmp/actprove-intercept-v4-review/poster.png').webp({quality:90,effort:5}).toFile('public/media/intercept-poster-v4.webp').catch(e=>{console.error(e);process.exit(1)});"]
try compression.run(); compression.waitUntilExit()
guard compression.terminationStatus == 0 else { throw RenderError.bitmap }

let frames = (0...Int(duration * Double(fps))).map { metadata(at: Double($0) / Double(fps)) }
let track: [String: Any] = ["version": 4, "width": frameWidth, "height": frameHeight, "fps": fps, "duration": duration,
                          "posterTime": posterTime, "illustrative": true, "coordinates": "normalized-unrotated-alpha-bounds",
                          "rotationConvention": "clockwise-degrees", "frames": frames]
let trackData = try JSONSerialization.data(withJSONObject: track, options: [.sortedKeys])
try trackData.write(to: media.appendingPathComponent("intercept-track-v4.json"))
for time in [0.0, 2.5, 5.0, 8.0, 9.0, 10.0, 11.0, 11.5, 11.8, 12.1, 13.0, 13.8] {
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
