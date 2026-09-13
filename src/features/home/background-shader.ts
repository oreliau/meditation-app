export const BACKGROUND_SHADER = /* wgsl */ `
struct Uniforms {
  resolution: vec2f,
  time: f32,
  isWeb: f32,
  background: vec4f,
  accentOne: vec4f,
  accentTwo: vec4f,
  accentThree: vec4f,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
}

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  var positions = array<vec2f, 3>(
    vec2f(-1.0, -1.0),
    vec2f(3.0, -1.0),
    vec2f(-1.0, 3.0),
  );
  let position = positions[vertexIndex];
  var output: VertexOutput;
  output.position = vec4f(position, 0.0, 1.0);
  output.uv = position * 0.5 + 0.5;
  return output;
}

fn softField(point: vec2f, center: vec2f, radius: f32) -> f32 {
  let distanceFromCenter = distance(point, center);
  return 1.0 - smoothstep(radius * 0.12, radius, distanceFromCenter);
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
  let aspect = uniforms.resolution.x / max(uniforms.resolution.y, 1.0);
  // On wide web canvases, spread the fields across the viewport instead of
  // leaving empty side bands. Portrait web and native keep their geometry.
  let fieldAspect = select(aspect, min(aspect, 1.0), uniforms.isWeb > 0.5);
  var point = input.uv;
  point.x = (point.x - 0.5) * fieldAspect + 0.5;

  let drift = uniforms.time * 0.055;
  let accentOneCenter = vec2f(
    0.14 + sin(drift * 0.73) * 0.09,
    0.76 + cos(drift * 0.61) * 0.08,
  );
  let accentTwoCenter = vec2f(
    0.82 + cos(drift * 0.57) * 0.10,
    0.22 + sin(drift * 0.69) * 0.09,
  );
  let accentThreeCenter = vec2f(
    0.52 + sin(drift * 0.41) * 0.12,
    0.51 + cos(drift * 0.47) * 0.10,
  );

  let accentOneAmount = softField(point, accentOneCenter, 0.72);
  let accentTwoAmount = softField(point, accentTwoCenter, 0.78);
  let accentThreeAmount = softField(point, accentThreeCenter, 0.62);

  var color = uniforms.background.rgb;
  color = mix(color, uniforms.accentOne.rgb, accentOneAmount * uniforms.accentOne.a);
  color = mix(color, uniforms.accentTwo.rgb, accentTwoAmount * uniforms.accentTwo.a);
  color = mix(color, uniforms.accentThree.rgb, accentThreeAmount * uniforms.accentThree.a);

  let vignette = smoothstep(0.95, 0.18, distance(input.uv, vec2f(0.5)));
  color *= 0.96 + vignette * 0.04;
  return vec4f(color, 1.0);
}
`;
