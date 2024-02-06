#version 430 core

in layout(location = 0) vec3 position;
in layout(location = 1) vec3 normal_in;
in layout(location = 2) vec2 textureCoordinates_in;

uniform mat4 MVP;
uniform mat4 modelMatrix;
uniform mat3 normalMatrix;

out layout(location = 0) vec3 normal_out;
out layout(location = 1) vec2 textureCoordinates_out;
out layout(location = 2) vec3 fragment_position_out;

void main()
{
    normal_out = normalMatrix * normal_in;
    textureCoordinates_out = textureCoordinates_in;
    gl_Position = MVP * vec4(position, 1.0f);
    fragment_position_out = vec3(modelMatrix * vec4(position, 1.0f));
}
