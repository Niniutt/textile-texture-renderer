#pragma once

#include <utilities/window.hpp>
#include "utilities/imageLoader.hpp"
#include "sceneGraph.hpp"

void updateNodeTransformations(SceneNode* node, glm::mat4 transformationThusFar, glm::mat4 viewTransformation);
void initGame(GLFWwindow* window, CommandLineOptions options);
void updateFrame(GLFWwindow* window);
void renderFrame(GLFWwindow* window);
unsigned int createTextureID(PNGImage image);

void imGuiInit(GLFWwindow* window);
void imGuiStartFrame(GLFWwindow* window);
void imGuiRenderFrame(GLFWwindow* window);
void imGuiShutdownFrame(GLFWwindow* window);