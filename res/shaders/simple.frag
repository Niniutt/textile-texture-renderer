#version 430 core

struct LightSource {
    vec3 position;
    vec3 source_color;
};

in layout(location = 0) vec3 normal;
in layout(location = 1) vec2 textureCoordinates;
in layout(location = 2) vec3 fragment_position;

uniform LightSource light_source;
// uniform layout(location = 6) vec3 light_position;
uniform layout(location = 7) vec3 camera_position;
uniform layout(location = 8) vec3 ball_position;

out vec4 color;

float rand(vec2 co) { return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453); }
float dither(vec2 uv) { return (rand(uv)*2.0-1.0) / 256.0; }
vec3 reject(vec3 from, vec3 onto) { return from - onto*dot(from, onto)/dot(onto, onto); }

#define ball_radius 3.0
#define diffuse_shadow_factor 0.5
#define specular_shadow_factor 0.1

void main()
{
    vec3 normal_out = normalize(normal);

    // Ambient
    vec3 ambient = vec3(0.1, 0.1, 0.1);

    // Shadows
    vec3 fl = light_source.position - fragment_position;
    vec3 fb = ball_position - fragment_position;
    bool cast_shadow = length(reject(fl, fb)) < ball_radius && length(fl) >= length(fb) && dot(fb, fl) >= 0;

    // Diffuse intensity
    vec3 light_direction = normalize(light_source.position - fragment_position);
    float diffuse_intensity = max(0.0, dot(light_direction, normal_out));

    // Specular intensity
    vec3 view_direction = normalize(camera_position - fragment_position);
    vec3 reflected_direction = reflect(-light_direction, normal_out);
    float specular_intensity = pow(max(0.0, dot(view_direction, reflected_direction)), 32);

    // Left-over component
    float d = length(fragment_position - light_source.position);
    float la = 1;
    float lb = 0.002;
    float lc = 0.001;
    float L = 1 / (la + lb * d + lc * d * d);
    
    // Dithering
    float noise = dither(textureCoordinates);

    // Diffuse & Specular vectors
    vec3 diffuse_color = vec3(1.0, 1.0, 1.0);
    vec3 diffuse = (cast_shadow? diffuse_shadow_factor : 1.0) * L * diffuse_intensity * diffuse_color + noise;
    vec3 specular_color = light_source.source_color; // vec3(0.0, 1.0, 1.0);
    vec3 specular = (cast_shadow? specular_shadow_factor : 1.0) * L * specular_intensity * specular_color + noise;

    // color = vec4(0.5 * normal_out + 0.5, 1.0);
    color = vec4(ambient + diffuse + specular, 1.0);
}