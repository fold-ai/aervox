// Original fictional mission-brand film. No sensor data or operational functions.
// Compile: swiftc -module-cache-path /tmp/actprove-swift-cache scripts/render-mission-hero.swift -o /tmp/render-actprove-mission-hero
// Run from the project root: /tmp/render-actprove-mission-hero [--frames-only]
import Foundation
import SceneKit
import simd
import AppKit
import Metal
import CoreImage
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
let output = media.appendingPathComponent("mission-hero-v1.mp4")
let reviewDirectory = URL(fileURLWithPath: "/private/tmp/actprove-mission-hero-review", isDirectory: true)
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


let ground = try loadImage("ground-road-clean.png")
let ciContext = CIContext(options: [.useSoftwareRenderer: false])
let gradedGroundCI = CIImage(cgImage: ground).applyingFilter("CIColorControls", parameters: ["inputSaturation": 0.37, "inputContrast": 1.12, "inputBrightness": -0.035])
let gradedGround = ciContext.createCGImage(gradedGroundCI, from: gradedGroundCI.extent)!

func terrainHeight(_ x: Float, _ z: Float) -> Float {
    let a = sin(x * 0.00072 + 0.5) * cos(z * 0.00061 - 0.4)
    let b = sin(x * 0.00171 + z * 0.00091) * 0.38
    let c = cos(x * 0.0031 - z * 0.0024) * 0.12
    let valley = exp(-pow((x * 0.50 - z * 0.74) / 1150, 2))
    return 110 + (a + b + c + 1.5) * 75 * (1 - valley * 0.67)
}

let scene = SCNScene()
scene.background.contents = NSImage(cgImage: background, size: .zero)
scene.fogColor = NSColor(calibratedRed: 0.17, green: 0.20, blue: 0.22, alpha: 1)
scene.fogStartDistance = 3100
scene.fogEndDistance = 10500
let segmentsX = 150, segmentsZ = 110
let worldWidth: Float = 18000, worldDepth: Float = 16000
var vertices: [SCNVector3] = [], normals: [SCNVector3] = [], uv: [CGPoint] = [], triangles: [Int32] = []
for j in 0...segmentsZ { for i in 0...segmentsX {
    let x = (Float(i) / Float(segmentsX) - 0.5) * worldWidth
    let z = (Float(j) / Float(segmentsZ) - 0.5) * worldDepth
    let h = terrainHeight(x, z)
    vertices.append(SCNVector3(x, h, z))
    let dx = (terrainHeight(x + 12, z) - h) / 12
    let dz = (terrainHeight(x, z + 12) - h) / 12
    let length = sqrt(dx * dx + dz * dz + 1)
    normals.append(SCNVector3(-dx / length, 1 / length, -dz / length))
    uv.append(CGPoint(x: Double(i) / Double(segmentsX), y: 1 - Double(j) / Double(segmentsZ)))
}}
for j in 0..<segmentsZ { for i in 0..<segmentsX {
    let a = Int32(j * (segmentsX + 1) + i), b = a + 1, c = a + Int32(segmentsX + 1), d = c + 1
    triangles += [a, c, b, b, c, d]
}}
let geometry = SCNGeometry(sources: [SCNGeometrySource(vertices: vertices), SCNGeometrySource(normals: normals), SCNGeometrySource(textureCoordinates: uv)], elements: [SCNGeometryElement(indices: triangles, primitiveType: .triangles)])
let material = SCNMaterial()
material.diffuse.contents = NSImage(cgImage: gradedGround, size: .zero)
material.lightingModel = .physicallyBased
material.roughness.contents = 0.95
material.metalness.contents = 0.0
material.multiply.contents = NSColor(calibratedRed: 0.78, green: 0.82, blue: 0.86, alpha: 1)
material.isDoubleSided = false
geometry.materials = [material]
scene.rootNode.addChildNode(SCNNode(geometry: geometry))
let ambient = SCNLight(); ambient.type = .ambient; ambient.intensity = 530; ambient.color = NSColor(calibratedRed: 0.76, green: 0.82, blue: 0.89, alpha: 1)
let ambientNode = SCNNode(); ambientNode.light = ambient; scene.rootNode.addChildNode(ambientNode)
let sun = SCNLight(); sun.type = .directional; sun.intensity = 1150; sun.color = NSColor(calibratedRed: 1, green: 0.87, blue: 0.75, alpha: 1)
let sunNode = SCNNode(); sunNode.light = sun; sunNode.eulerAngles = SCNVector3(-0.75, -0.55, 0); scene.rootNode.addChildNode(sunNode)

let sensingLines = SCNNode()
for band in 0..<6 {
    var points: [SCNVector3] = []
    var indices: [Int32] = []
    for sample in 0...95 {
        let z = -3700 + Float(sample) * 78
        let x = -2600 + Float(band) * 850 + sin(z * 0.00085 + Float(band) * 0.65) * 440
        points.append(SCNVector3(x, terrainHeight(x, z) + 16, z))
        if sample > 0 { indices += [Int32(sample - 1), Int32(sample)] }
    }
    let line = SCNGeometry(sources: [SCNGeometrySource(vertices: points)], elements: [SCNGeometryElement(indices: indices, primitiveType: .line)])
    let ink = SCNMaterial(); ink.lightingModel = .constant
    ink.diffuse.contents = band == 3 ? NSColor(calibratedRed: 0.77, green: 0.49, blue: 0.34, alpha: 1) : NSColor(calibratedWhite: 0.90, alpha: 1)
    ink.transparency = band == 3 ? 0.85 : 0.34
    ink.readsFromDepthBuffer = true
    line.materials = [ink]
    sensingLines.addChildNode(SCNNode(geometry: line))
}
scene.rootNode.addChildNode(sensingLines)
let camera = SCNCamera(); camera.fieldOfView = 58; camera.zNear = 5; camera.zFar = 22000; camera.wantsHDR = false
let cameraNode = SCNNode(); cameraNode.camera = camera; scene.rootNode.addChildNode(cameraNode)
guard let device = MTLCreateSystemDefaultDevice() else { throw RenderError.writer("Metal renderer unavailable") }
let terrainRenderer = SCNRenderer(device: device, options: nil)
terrainRenderer.scene = scene; terrainRenderer.pointOfView = cameraNode
terrainRenderer.autoenablesDefaultLighting = false

// Set an absolute view basis every frame. Incremental Euler rotation accumulates across snapshots.
func placeCamera(position: SIMD3<Float>, target: SIMD3<Float>, roll: Float = 0) {
    let backward = simd_normalize(position - target)
    let right = simd_normalize(simd_cross(SIMD3<Float>(0, 1, 0), backward))
    let up = simd_cross(backward, right)
    let rolledRight = right * cos(roll) + up * sin(roll)
    let rolledUp = up * cos(roll) - right * sin(roll)
    cameraNode.simdTransform = simd_float4x4(columns: (
        SIMD4<Float>(rolledRight, 0), SIMD4<Float>(rolledUp, 0),
        SIMD4<Float>(backward, 0), SIMD4<Float>(position, 1)
    ))
}

func terrainFrame(phase: Int, progress: Double, time: Double) throws -> CGImage {
    let p = Float(progress)
    SCNTransaction.begin()
    SCNTransaction.disableActions = true
    sensingLines.isHidden = phase != 2
    if phase == 1 {
        placeCamera(position: SIMD3<Float>(2400 - p * 3600, 5000 - p * 700, 3500 - p * 4100),
                    target: SIMD3<Float>(1600 - p * 3400, 150, 2100 - p * 3300),
                    roll: Float(sin(progress * .pi * 1.1)) * 0.07)
        camera.fieldOfView = 58
    } else {
        let angle = Float(-0.1 + progress * 0.80)
        placeCamera(position: SIMD3<Float>(sin(angle) * 1800 + 450, 5900 - p * 550, cos(angle) * 1500 - p * 1800),
                    target: SIMD3<Float>(-150, 230, -600))
        camera.fieldOfView = 53
    }
    SCNTransaction.commit()
    SCNTransaction.flush()
    terrainRenderer.sceneTime = time
    let snapshot = terrainRenderer.snapshot(atTime: time, with: CGSize(width: frameWidth, height: frameHeight), antialiasingMode: .multisampling2X)
    guard let cg = snapshot.cgImage(forProposedRect: nil, context: nil, hints: nil) else { throw RenderError.bitmap }
    return cg
}

func aircraft(x: Double, y: Double, width: Double, bank: Double, alpha: Double, context: CGContext) {
    let w = width * Double(frameWidth), h = width * Double(frameWidth) * Double(drone.height) / Double(drone.width)
    context.saveGState(); context.setAlpha(alpha)
    context.translateBy(x: x * Double(frameWidth), y: (1-y) * Double(frameHeight))
    context.rotate(by: bank * .pi / 180)
    context.draw(drone, in: CGRect(x: -w/2, y: -h/2, width: w, height: h))
    context.restoreGState()
}

func drawSkyPass(progress: Double, context: CGContext) {
    let p = progress
    let scale = 1.21 + p * 0.05
    let w = Double(frameWidth) * scale, h = w * Double(background.height) / Double(background.width)
    context.saveGState()
    context.translateBy(x: Double(frameWidth) / 2, y: Double(frameHeight) / 2)
    context.rotate(by: mix(-3.0, 3.5, p) * .pi / 180)
    context.draw(background, in: CGRect(x: -w/2 + mix(35, -45, p), y: -h/2 + mix(-8, 18, p), width: w, height: h))
    context.restoreGState()
    // Separate subjects move at different apparent depths during a close camera pass.
    aircraft(x: mix(0.47, 0.24, p), y: mix(0.35, 0.29, p), width: 0.043 + p * 0.006, bank: -3, alpha: 0.67, context: context)
    aircraft(x: mix(0.91, 0.56, p), y: mix(0.34, 0.41, p), width: 0.105 + p * 0.018, bank: mix(8, -4, p), alpha: 0.85, context: context)
    aircraft(x: mix(0.96, 0.35, p), y: mix(0.46, 0.64, p), width: mix(0.36, 0.87, p * p * (3 - 2 * p)), bank: mix(-13, 7, p) + sin(p * .pi) * 4, alpha: 1, context: context)
}

func drawShot(phase: Int, progress: Double, context: CGContext) throws {
    if phase == 0 { drawSkyPass(progress: progress, context: context) }
    else {
        context.draw(try terrainFrame(phase: phase, progress: progress, time: Double(phase) * 6 + progress * 6), in: CGRect(x: 0, y: 0, width: frameWidth, height: frameHeight))
        if phase == 1 {
            // Authored chase-shot foreground; the terrain camera moves independently below.
            aircraft(x: 0.71 + sin(progress * .pi * 1.5) * 0.055,
                     y: 0.46 + progress * 0.06,
                     width: 0.33 + sin(progress * .pi) * 0.05,
                     bank: -12 + sin(progress * .pi * 1.4) * 19,
                     alpha: 0.96, context: context)
        }
    }
}

func drawFrame(time: Double, context: CGContext) {
    let phase = min(2, Int(time / 6))
    let local = time - Double(phase) * 6
    do {
        try drawShot(phase: phase, progress: min(1, local / 6), context: context)
        if local > 5.70 {
            context.saveGState(); context.setAlpha(smooth((local - 5.70) / 0.30))
            try drawShot(phase: (phase + 1) % 3, progress: 0, context: context)
            context.restoreGState()
        }
    } catch { fatalError("Mission frame render failed: \(error)") }
    context.setFillColor(ink(0.015, 0.020, 0.028, 0.055))
    context.fill(CGRect(x: 0, y: 0, width: frameWidth, height: frameHeight))
}

func stillImage(at time: Double) throws -> CGImage {
    guard let context = CGContext(data: nil, width: frameWidth, height: frameHeight, bitsPerComponent: 8, bytesPerRow: frameWidth * 4, space: colorSpace, bitmapInfo: bitmapInfo) else { throw RenderError.bitmap }
    context.interpolationQuality = .high
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
for (index,time) in [2.8, 8.3, 14.0].enumerated() {
    try writePNG(stillImage(at: time), to: reviewDirectory.appendingPathComponent("mission-hero-phase-\(index).png"))
}
for time in [0.0, 1.3, 3.2, 5.2, 6.1, 8.3, 11.1, 12.1, 14.0, 17.1] {
    try writePNG(stillImage(at: time), to: reviewDirectory.appendingPathComponent("frame-\(time).png"))
}
let compression = Process(); compression.executableURL = URL(fileURLWithPath: "/usr/bin/env")
compression.arguments = ["node", "-e", "const sharp=require('sharp'); (async()=>{for(let i=0;i<3;i++) await sharp('/private/tmp/actprove-mission-hero-review/mission-hero-phase-'+i+'.png').webp({quality:88,effort:5}).toFile('public/media/mission-hero-phase-'+i+'.webp');})().catch(e=>{console.error(e);process.exit(1)});"]
try compression.run(); compression.waitUntilExit()
guard compression.terminationStatus == 0 else { throw RenderError.bitmap }
print("Mission hero review frames: \(reviewDirectory.path)"); fflush(stdout)
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
        AVVideoAverageBitRateKey: 10_000_000,
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
        if [30, 90, 185, 270, 350, 390, 455, 525].contains(frame), let rendered = context.makeImage() {
            try writePNG(rendered, to: reviewDirectory.appendingPathComponent("sequence-\(frame).png"))
        }
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
