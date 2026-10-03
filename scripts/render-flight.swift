// Original illustrative marketing animation. No live sensor data or detection logic.
// Compile: swiftc -module-cache-path /tmp/actprove-swift-cache scripts/render-flight.swift -o /tmp/render-actprove-flight
// Run from the project root: /tmp/render-actprove-flight [--frames-only]
import Foundation
import AVFoundation
import CoreGraphics
import CoreVideo
import CoreMedia
import CoreText
import ImageIO
import UniformTypeIdentifiers
import VideoToolbox

let frameWidth = 1280
let frameHeight = 720
let fps: Int32 = 30
let duration = 16.0
let project = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let media = project.appendingPathComponent("public/media")
let output = media.appendingPathComponent("flight-sequence.mp4")
let poster = media.appendingPathComponent("flight-poster.png")
let reviewDirectory = URL(fileURLWithPath: "/private/tmp/actprove-flight-review", isDirectory: true)
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

let background = try loadImage("flight-clouds.png")
let fullDrone = try loadImage("flight-drone.png")
let bounds = try alphaBounds(fullDrone)
guard let drone = fullDrone.cropping(to: bounds) else { throw RenderError.invalidImage("Drone alpha crop") }
print("Drone source \(fullDrone.width)×\(fullDrone.height), alpha bounds \(bounds)")

func clamp(_ value: Double, _ lo: Double = 0, _ hi: Double = 1) -> Double { min(hi, max(lo, value)) }
func smooth(_ value: Double) -> Double { let x = clamp(value); return x * x * (3 - 2 * x) }
func mix(_ a: Double, _ b: Double, _ t: Double) -> Double { a + (b - a) * t }
func ink(_ r: CGFloat, _ g: CGFloat, _ b: CGFloat, _ alpha: CGFloat = 1) -> CGColor {
    CGColor(colorSpace: colorSpace, components: [r, g, b, alpha])!
}

let white = ink(0.96, 0.95, 0.92)
let amber = ink(0.81, 0.60, 0.44)
let quietWhite = ink(0.87, 0.88, 0.86)

func text(_ value: String, at point: CGPoint, size: CGFloat, color: CGColor, context: CGContext, tracking: CGFloat = 1.2) {
    let font = CTFontCreateWithName("Menlo-Regular" as CFString, size, nil)
    let attrs: [NSAttributedString.Key: Any] = [
        NSAttributedString.Key(kCTFontAttributeName as String): font,
        NSAttributedString.Key(kCTForegroundColorAttributeName as String): color,
        NSAttributedString.Key(kCTKernAttributeName as String): tracking,
    ]
    let line = CTLineCreateWithAttributedString(NSAttributedString(string: value, attributes: attrs))
    context.saveGState()
    context.textMatrix = .identity
    context.textPosition = point
    context.setShadow(offset: CGSize(width: 0, height: -1), blur: 3, color: ink(0, 0, 0, 0.65))
    CTLineDraw(line, context)
    context.restoreGState()
}

struct AircraftState {
    let x: Double
    let y: Double // Fraction down from the top of the frame.
    let width: Double
    let bank: Double
    let acquisition: Double
    let locked: Bool
}

func state(at time: Double) -> AircraftState {
    if time < 2 {
        let p = smooth(time / 2)
        return AircraftState(x: mix(0.55, 0.548, p), y: mix(0.48, 0.471, p),
                             width: mix(0.07, 0.09, p), bank: mix(-1.2, 0.7, p), acquisition: 0, locked: false)
    }
    if time < 4 {
        let p = smooth((time - 2) / 2)
        return AircraftState(x: mix(0.548, 0.55, p), y: mix(0.471, 0.474, p),
                             width: mix(0.09, 0.105, p), bank: mix(0.7, -0.4, p), acquisition: p, locked: false)
    }
    let p = smooth((time - 4) / 8)
    let drift = sin(clamp((time - 4) / 8) * Double.pi)
    let settled = time > 12 ? sin((time - 12) * Double.pi / 3) : 0
    return AircraftState(x: mix(0.55, 0.572, p) + drift * 0.009 + settled * 0.0015,
                         y: mix(0.474, 0.53, p) - drift * 0.006 + settled * 0.001,
                         width: mix(0.105, 0.42, pow(p, 1.13)),
                         bank: mix(-0.4, 1.3, p) + drift * 2.1 + settled * 0.2,
                         acquisition: 1, locked: true)
}

func drawAircraft(_ aircraft: AircraftState, alpha: Double, context: CGContext) {
    guard alpha > 0.001 else { return }
    let width = aircraft.width * Double(frameWidth)
    let height = width * Double(drone.height) / Double(drone.width)
    context.saveGState()
    context.setAlpha(alpha)
    context.translateBy(x: aircraft.x * Double(frameWidth), y: (1 - aircraft.y) * Double(frameHeight))
    context.rotate(by: aircraft.bank * .pi / 180)
    context.interpolationQuality = .high
    context.draw(drone, in: CGRect(x: -width / 2, y: -height / 2, width: width, height: height))

    if aircraft.acquisition > 0 || aircraft.locked {
        // The annotation receives the exact aircraft translation and bank; neither can drift.
        let acquisition = aircraft.acquisition
        let expansion = mix(1.7, 1, acquisition)
        let padding = mix(20, 8, acquisition)
        let w = width * expansion + padding * 2
        let h = height * expansion + padding * 2
        let left = -w / 2, right = w / 2, bottom = -h / 2, top = h / 2
        let length = min(22.0, max(12.0, width * 0.045))
        context.setAlpha(alpha * (aircraft.locked ? 0.87 : min(0.88, 0.18 + acquisition * 1.3)))
        context.setStrokeColor(aircraft.locked ? white : amber)
        context.setLineWidth(1.05)
        context.setLineCap(.butt)
        let path = CGMutablePath()
        for (x, y, dx, dy) in [(left, top, 1.0, -1.0), (right, top, -1.0, -1.0),
                               (left, bottom, 1.0, 1.0), (right, bottom, -1.0, 1.0)] {
            path.move(to: CGPoint(x: x + dx * length, y: y))
            path.addLine(to: CGPoint(x: x, y: y))
            path.addLine(to: CGPoint(x: x, y: y + dy * length))
        }
        context.addPath(path)
        context.strokePath()
        if aircraft.locked || acquisition > 0.65 {
            text("AIRCRAFT  A-01", at: CGPoint(x: left, y: top + 12), size: 9,
                 color: white, context: context, tracking: 0.9)
        }
    }
    context.restoreGState()
}

func drawStatus(_ value: String, alpha: Double, acquiring: Bool, context: CGContext) {
    guard alpha > 0.001 else { return }
    context.saveGState()
    context.setAlpha(alpha)
    context.setFillColor(acquiring ? amber : quietWhite)
    context.fill(CGRect(x: 42, y: frameHeight - 45, width: 4, height: 4))
    text(value, at: CGPoint(x: 57, y: frameHeight - 45), size: 10, color: quietWhite, context: context)
    context.restoreGState()
}

func drawFrame(time: Double, context: CGContext) {
    let phase = time / duration * .pi * 2
    let breathing = pow(sin(time / duration * .pi), 2)
    let scale = 1.018 + 0.017 * breathing
    let backgroundWidth = Double(frameWidth) * scale
    let backgroundHeight = backgroundWidth * Double(background.height) / Double(background.width)
    let x = (Double(frameWidth) - backgroundWidth) / 2 + sin(phase) * 2
    let y = (Double(frameHeight) - backgroundHeight) / 2 + sin(phase) * 1.2
    context.interpolationQuality = .high
    context.draw(background, in: CGRect(x: x, y: y, width: backgroundWidth, height: backgroundHeight))
    // A light cinematic grade keeps the source image visible and annotations legible.
    context.setFillColor(ink(0.015, 0.025, 0.035, 0.07))
    context.fill(CGRect(x: 0, y: 0, width: frameWidth, height: frameHeight))
    let colors = [ink(0.01, 0.02, 0.025, 0.38), ink(0, 0, 0, 0), ink(0, 0, 0, 0.15)] as CFArray
    let gradient = CGGradient(colorsSpace: colorSpace, colors: colors, locations: [0, 0.42, 1])!
    context.drawLinearGradient(gradient, start: CGPoint(x: 0, y: 0), end: CGPoint(x: 0, y: frameHeight), options: [])

    if time >= 14 {
        let p = smooth((time - 14) / 2)
        drawAircraft(state(at: 14), alpha: 1 - p, context: context)
        drawAircraft(state(at: 0), alpha: p, context: context)
        drawStatus("TRACK LOCKED", alpha: 1 - p, acquiring: false, context: context)
        drawStatus("SEARCHING", alpha: p, acquiring: false, context: context)
    } else {
        drawAircraft(state(at: time), alpha: 1, context: context)
        let caption = time < 2 ? "SEARCHING" : time < 4 ? "ACQUIRING" : "TRACK LOCKED"
        drawStatus(caption, alpha: 1, acquiring: time >= 2 && time < 4, context: context)
    }
    text("CINEMATIC SIMULATION", at: CGPoint(x: 42, y: 32), size: 9, color: quietWhite,
         context: context, tracking: 1.3)
}

func stillImage(at time: Double) throws -> CGImage {
    guard let context = CGContext(data: nil, width: frameWidth, height: frameHeight, bitsPerComponent: 8,
        bytesPerRow: frameWidth * 4, space: colorSpace, bitmapInfo: bitmapInfo) else { throw RenderError.bitmap }
    drawFrame(time: time, context: context)
    guard let result = context.makeImage() else { throw RenderError.bitmap }
    return result
}

func writePNG(_ image: CGImage, to url: URL) throws {
    guard let destination = CGImageDestinationCreateWithURL(url as CFURL, UTType.png.identifier as CFString, 1, nil) else {
        throw RenderError.invalidImage("PNG destination")
    }
    CGImageDestinationAddImage(destination, image, nil)
    guard CGImageDestinationFinalize(destination) else { throw RenderError.invalidImage("PNG encoding") }
}

try FileManager.default.createDirectory(at: reviewDirectory, withIntermediateDirectories: true)
try writePNG(stillImage(at: 11), to: poster)
for time in [0.0, 3.0, 6.0, 11.0, 14.0, 15.5] {
    try writePNG(stillImage(at: time), to: reviewDirectory.appendingPathComponent("frame-\(time).png"))
}
print("Poster: \(poster.path)")
print("Review frames: \(reviewDirectory.path)")
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
        AVVideoAverageBitRateKey: 4_800_000,
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
