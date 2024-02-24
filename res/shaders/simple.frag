#version 430 core

#define number_lights 3
#define ball_radius 3.0
#define diffuse_shadow_factor 0.5
#define specular_shadow_factor 0.1

struct LightSource {
    vec3 position;
    vec3 source_color;
};

in layout(location = 0) vec3 normal;
in layout(location = 1) vec2 textureCoordinates;
in layout(location = 2) vec3 fragment_position;
in layout(location = 3) mat3 TBN_matrix;

uniform LightSource light_source[number_lights];
// uniform layout(location = 6) vec3 light_position;
uniform vec3 camera_position;
uniform vec3 ball_position;
// Textures
uniform int textured;
uniform int normal_mapping;
layout(binding = 0) uniform sampler2D diffuse_texture;
layout(binding = 1) uniform sampler2D normal_texture;

out vec4 color;

float rand(vec2 co) { return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453); }
float dither(vec2 uv) { return (rand(uv)*2.0-1.0) / 256.0; }
vec3 reject(vec3 from, vec3 onto) { return from - onto*dot(from, onto)/dot(onto, onto); }
vec4 phong(vec3 normal_out) {
    // Ambient
    vec3 ambient = vec3(0.1, 0.1, 0.1);
    vec3 diffuse;
    vec3 specular;
    vec3 test;
    for	(int i = 0; i < number_lights; i++) {

        // Shadows
        vec3 fl = light_source[i].position - fragment_position;
        vec3 fb = ball_position - fragment_position;
        bool cast_shadow = length(reject(fb, fl)) < ball_radius && length(fl) >= length(fb) && dot(fb, fl) >= 0;

        // Diffuse intensity
        vec3 light_direction = normalize(light_source[i].position - fragment_position);
        float diffuse_intensity = max(0.0, dot(light_direction, normal_out));

        // Specular intensity
        vec3 view_direction = normalize(camera_position - fragment_position);
        vec3 reflected_direction = reflect(-light_direction, normal_out);
        float specular_intensity = pow(max(0.0, dot(view_direction, reflected_direction)), 32);

        // Left-over component
        float d = length(fragment_position - light_source[i].position);
        float la = 1;
        float lb = 0.002;
        float lc = 0.001;
        float L = 1 / (la + lb * d + lc * d * d);

        // Diffuse & Specular vectors
        vec3 diffuse_color = light_source[i].source_color;
        diffuse += (cast_shadow? 0.0 : 1.0) * L * diffuse_intensity * diffuse_color;
        vec3 specular_color = light_source[i].source_color; // vec3(0.0, 1.0, 1.0);
        specular += (cast_shadow? 0.0 : 1.0) * L * specular_intensity * specular_color;

        test[i] = cast_shadow? 1.0 : 0.0;
    }
        
    // Dithering
    float noise = 0*dither(textureCoordinates); // 2 for more correction


    return vec4(ambient + diffuse + specular + noise, 1.0); // test, 1.0);//
}

void main()
{
    vec3 normal_out = normalize(normal);

    if (textured == 0 && normal_mapping == 0) {
        color = phong(normal_out);
    } else if (normal_mapping == 1) {
        vec3 normal = normalize(TBN_matrix * (texture(normal_texture, textureCoordinates).rgb * 2 - 1));
        color = phong(normal) * texture(diffuse_texture, textureCoordinates);
        // color = vec4(normal, 1.0);
    } else {
        color = texture(diffuse_texture, textureCoordinates);
    }

    // color = vec4(0.5 * normal_out + 0.5, 1.0);
}