#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Define the structure for each node in the tree
typedef struct TreeNode {
  char* id;
  char* title;
  char* description;
  char* markdown;
  char* html;
  struct TreeNode* parent;
  struct TreeNode** children;
  int numChildren;
} TreeNode;

// Define functions for creating and destroying tree nodes
TreeNode* createNode(char* id, char* title, char* description, char* markdown, char* html) {
  TreeNode* node = malloc(sizeof(TreeNode));
  node->id = strdup(id);
  node->title = strdup(title);
  node->description = strdup(description);
  node->markdown = strdup(markdown);
  node->html = strdup(html);
  node->parent = NULL;
  node->children = NULL;
  node->numChildren = 0;
  return node;
}

void destroyNode(TreeNode* node) {
  free(node->id);
  free(node->title);
  free(node->description);
  free(node->markdown);
  free(node->html);
  if (node->children) {
    for (int i = 0; i < node->numChildren; i++) {
      destroyNode(node->children[i]);
    }
    free(node->children);
  }
  free(node);
}

// Define functions for adding and removing child nodes from a parent node
void addChild(TreeNode* parent, TreeNode* child) {
  child->parent = parent;
  parent->numChildren++;
  parent->children = realloc(parent->children, parent->numChildren * sizeof(TreeNode*));
  parent->children[parent->numChildren-1] = child;
}

void removeChild(TreeNode* parent, TreeNode* child) {
  for (int i = 0; i < parent->numChildren; i++) {
    if (parent->children[i] == child) {
      // Remove the child from the parent's array of children
      for (int j = i; j < parent->numChildren-1; j++) {
        parent->children[j] = parent->children[j+1];
      }
      parent->numChildren--;
      parent->children = realloc(parent->children, parent->numChildren * sizeof(TreeNode*));
      child->parent = NULL;
      break;
    }
  }
}

// Define a function for updating a node's properties
void updateNode(TreeNode* node, char* title, char* description, char* markdown, char* html) {
  free(node->title);
  free(node->description);
  free(node->markdown);
  free(node->html);
  node->title = strdup(title);
  node->description = strdup(description);
  node->markdown = strdup(markdown);
  node->html = strdup(html);
}

// Define a function for traversing the tree and printing each node's properties
void traverseTree(TreeNode* node, int level) {
  printf("%*s%s\n", level*2, "", node->id);
  printf("%*s%s\n", level*2, "", node->title);
  printf("%*s%s\n", level*2, "", node->description);
  printf("%*s%s\n", level*2, "", node->markdown);
  printf("%*s%s\n", level*2, "", node->html);
  for (int i = 0; i < node->numChildren; i++) {
    traverseTree(node->children[i], level+1);
  }
}
