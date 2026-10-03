// Original illustrative marketing animation. No live sensor data or detection logic.
// Compile: swiftc -module-cache-path /tmp/actprove-swift-cache scripts/render-flight.swift -o /tmp/render-actprove-flight-v2
// Run from the project root: /tmp/render-actprove-flight-v2 [--frames-only]
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
let output = media.appendingPathComponent("flight-sequence-v2.mp4")
let poster = media.appendingPathComponent("flight-poster-v2.png")
let reviewDirectory = URL(fileURLWithPath: "/private/tmp/actprove-flight-v2-review", isDirectory: true)
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

struct AircraftState {
    let x: Double
    let y: Double
    let width: Double
    let bank: Double
}

// Original authored camera choreography; these are illustration coordinates only.
func state(at time: Double) -> AircraftState {
    let p = smooth(clamp(time / 15.7))
    let approach = pow(p, 1.12)
    let arc = sin(clamp(time / 15.7) * .pi)
    return AircraftState(
        x: mix(0.755, 0.565, p) + 0.018 * sin(time * 0.34) * arc,
        y: mix(0.385, 0.555, p) - 0.016 * sin(time * 0.42) * arc,
        width: mix(0.075, 0.615, approach),
        bank: mix(-7.0, -1.2, p) + 6.7 * sin(time * 0.42) * arc
    )
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
    context.restoreGState()
}

func drawBackground(time: Double, alpha: Double, context: CGContext) {
    let p = smooth(clamp(time / 16.2))
    let scale = mix(1.045, 1.14, p)
    let backgroundWidth = Double(frameWidth) * scale
    let backgroundHeight = backgroundWidth * Double(background.height) / Double(background.width)
    let x = (Double(frameWidth) - backgroundWidth) / 2 + mix(8, -38, p)
    let y = (Double(frameHeight) - backgroundHeight) / 2 + mix(-4, 13, p)
    context.saveGState()
    context.setAlpha(alpha)
    context.interpolationQuality = .high
    context.draw(background, in: CGRect(x: x, y: y, width: backgroundWidth, height: backgroundHeight))
    context.restoreGState()
}

func drawFrame(time: Double, context: CGContext) {
    let reset = smooth((time - 16.3) / 1.7)
    drawBackground(time: min(time, 16.3), alpha: 1, context: context)
    if reset > 0 { drawBackground(time: 0, alpha: reset, context: context) }
    context.setFillColor(ink(0.02, 0.03, 0.045, 0.035))
    context.fill(CGRect(x: 0, y: 0, width: frameWidth, height: frameHeight))
    drawAircraft(state(at: min(time, 16.3)), alpha: 1 - reset, context: context)
    if reset > 0 { drawAircraft(state(at: 0), alpha: reset, context: context) }
}

func metadata(at time: Double) -> [String: Any] {
    let aircraft = state(at: min(time, 16.3))
    let width = aircraft.width * Double(frameWidth)
    let height = width * Double(drone.height) / Double(drone.width)
    let acquiring = smooth((time - 1.35) / 1.7)
    let opacity = time < 1.35 ? 0 : time > 16.3 ? max(0, 1 - (time - 16.3) / 0.7) : min(1, (time - 1.35) / 0.3)
    let phase = time < 1.35 ? "Observing" : time < 3.05 ? "Acquiring" : time < 5 ? "Track acquired" : time < 16.3 ? "Following" : "Sequence reset"
    return [
        "t": time,
        "cx": aircraft.x * Double(frameWidth),
        "cy": aircraft.y * Double(frameHeight),
        "w": width,
        "h": height,
        "rotation": -aircraft.bank,
        "opacity": opacity,
        "acquisition": acquiring,
        "phase": phase,
        "zoom": aircraft.width / 0.075,
        "confidence": time < 3.05 ? mix(62, 98, acquiring) : 98,
    ]
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
try writePNG(stillImage(at: 13), to: poster)
try writePNG(stillImage(at: 0), to: media.appendingPathComponent("flight-start-v2.png"))

// Keep full-resolution source stills and lighter web-facing posters in sync.
let compressPosters = Process()
compressPosters.executableURL = URL(fileURLWithPath: "/usr/bin/env")
compressPosters.arguments = ["node", "-e", "const sharp=require('sharp'); (async()=>{for(const n of ['flight-start-v2','flight-poster-v2']) await sharp('public/media/'+n+'.png').webp({quality:88,effort:5}).toFile('public/media/'+n+'.webp');})().catch(e=>{console.error(e);process.exit(1)});"]
try compressPosters.run()
compressPosters.waitUntilExit()
guard compressPosters.terminationStatus == 0 else { throw RenderError.invalidImage("WebP poster compression") }

let samples = (0...Int(duration * Double(fps))).map { metadata(at: Double($0) / Double(fps)) }
let track: [String: Any] = ["version": 2, "width": frameWidth, "height": frameHeight, "fps": fps, "duration": duration, "posterTime": 13, "illustrative": true, "samples": samples]
let trackData = try JSONSerialization.data(withJSONObject: track, options: [.sortedKeys])
try trackData.write(to: media.appendingPathComponent("flight-track-v2.json"))
for time in [0.0, 2.2, 5.0, 9.0, 13.0, 16.0, 17.2] {
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
        AVVideoAverageBitRateKey: 8_500_000,
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
