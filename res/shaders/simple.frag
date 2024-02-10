#version 430 core

in layout(location = 0) vec3 normal;
in layout(location = 1) vec2 textureCoordinates;
in layout(location = 2) vec3 fragment_position;

uniform layout(location = 6) vec3 light_position;
uniform layout(location = 7) vec3 camera_position;

out vec4 color;

float rand(vec2 co) { return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453); }
float dither(vec2 uv) { return (rand(uv)*2.0-1.0) / 256.0; }

void main()
{
    vec3 normal_out = normalize(normal);

    // Ambient
    vec3 ambient = vec3(0.1, 0.1, 0.1);

    // Diffuse intensity
    vec3 light_direction = normalize(light_position - fragment_position);
    float diffuse_intensity = max(0.0, dot(light_direction, normal_out));

    // Specular intensity
    vec3 view_direction = normalize(camera_position - fragment_position);
    vec3 reflected_direction = reflect(-light_direction, normal_out);
    float specular_intensity = pow(max(0.0, dot(view_direction, reflected_direction)), 32);

    // Left-over component
    float d = length(fragment_position - light_position);
    float la = 1;
    float lb = 0.002;
    float lc = 0.001;
    float L = 1 / (la + lb * d + lc * d * d);
    
    // Dithering
    float noise = dither(textureCoordinates);

    // Diffuse & Specular vectors
    vec3 diffuse_color = vec3(1.0, 1.0, 1.0);
    vec3 diffuse = L * diffuse_intensity * diffuse_color + noise;
    vec3 specular_color = vec3(0.0, 1.0, 1.0);
    vec3 specular = L * specular_intensity * specular_color + noise;


    // color = vec4(0.5 * normal_out + 0.5, 1.0);
    color = vec4(ambient + diffuse + specular, 1.0);
}