export const SANCTUARY_SHADER = /* wgsl */ `
struct Uniforms {
  resolution: vec2f,
  time: f32,
  _padding: f32,
  background: vec4f,
  terracotta: vec4f,
  amber: vec4f,
  glow: vec4f,
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
  var point = input.uv;
  point.x = (point.x - 0.5) * aspect + 0.5;

  let drift = uniforms.time * 0.055;
  let terracottaCenter = vec2f(
    0.14 + sin(drift * 0.73) * 0.09,
    0.76 + cos(drift * 0.61) * 0.08,
  );
  let amberCenter = vec2f(
    0.82 + cos(drift * 0.57) * 0.10,
    0.22 + sin(drift * 0.69) * 0.09,
  );
  let glowCenter = vec2f(
    0.52 + sin(drift * 0.41) * 0.12,
    0.51 + cos(drift * 0.47) * 0.10,
  );

  let terracottaAmount = softField(point, terracottaCenter, 0.72);
  let amberAmount = softField(point, amberCenter, 0.78);
  let glowAmount = softField(point, glowCenter, 0.62);

  var color = uniforms.background.rgb;
  color = mix(color, uniforms.terracotta.rgb, terracottaAmount * uniforms.terracotta.a);
  color = mix(color, uniforms.amber.rgb, amberAmount * uniforms.amber.a);
  color = mix(color, uniforms.glow.rgb, glowAmount * uniforms.glow.a);

  let vignette = smoothstep(0.95, 0.18, distance(input.uv, vec2f(0.5)));
  color *= 0.96 + vignette * 0.04;
  return vec4f(color, 1.0);
}
`;
