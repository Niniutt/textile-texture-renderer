#version 430 core

#define NB_LIGHTS 3

in layout(location = 0) vec3 normal_in;
in layout(location = 1) vec2 textureCoordinates;
in layout(location = 2) vec3 fragmentPosition;

uniform vec3 lightPos;//[NB_LIGHTS];
uniform vec3 cameraPosition;

out vec4 color;

float rand(vec2 co) { return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453); }
float dither(vec2 uv) { return (rand(uv)*2.0-1.0) / 256.0; }

void main()
{
    
    vec3 normal = normalize(normal_in);

    // ambiant lighting
    vec3 ambiant = vec3(0.1, 0.1, 0.1);

    vec3 diffuse;
    vec3 specular;
    vec3 lightColor = vec3(1.0, 1.0, 1.0);
    vec3 lightDirection;
    int i = 2;
    /*{ 
        // diffuse lighting
        lightDirection = normalize(fragmentPosition - lightPos[i]);
        float diffuseStrength = max(0.0, dot(lightDirection, normal));
        diffuse += diffuseStrength * lightColor;

        // specular light
        vec3 viewDirection = normalize(cameraPosition - fragmentPosition);
        vec3 reflectDirection = reflect(lightDirection, normal);
        float specularStrength = pow(max(dot(viewDirection, reflectDirection), 0.0), 32);
        specular += specularStrength + lightColor; 
    }*/
    lightDirection = normalize(fragmentPosition - lightPos);
    float diffuseStrength = max(0.0, dot(lightDirection, normal));
    lightColor = vec3(1.0, 1.0, 1.0);
    diffuse = diffuseStrength * lightColor;

    // result
    // color = vec4(0.0 * ambiant + 1.0 * diffuse + 0.0 * specular, 1.0);
    // lightDirection is not correct
    color = vec4(lightDirection * 0.5 + vec3(1.0), 1.0);
}