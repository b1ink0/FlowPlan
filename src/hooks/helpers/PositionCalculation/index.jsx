// function to calculate the number of all children for that parent
const handleNumberOfAllChildrenForThatParent = (
  node,
  i = 1,
  root,
  parentLocation = null,
  location
) => {
  // if the node has no children or the node is not expanded,
  // then the number of all children for that parent is 1
  node.location = parentLocation ? [...parentLocation, location] : [];

  if (node?.children?.length === 0 || node?.expanded === false) {
    node.numberOfAllChildren = 1;
    // update the number of levels
    if (i > root.numberOfLevels || !root?.numberOfLevels)
      root.numberOfLevels = i;
    return 1;
  }
  // initialize count
  let count = 0;
  // loop through children of the node
  node?.children?.forEach((child, index) => {
    // add the number of all children for that child to count
    count += handleNumberOfAllChildrenForThatParent(
      child,
      i + 1,
      root,
      node.location,
      index
    );
  });
  // update the number of children for that parent
  node.numberOfAllChildren = count;
  // return count
  return count;
};

// function to calculate the final position of the node
const handleFinalPositionCalculation = (node, i) => {
  let count = i;
  // final position of the node is the number of all children for that parent / 2 + i
  node.fp = node.numberOfAllChildren / 2 + i;
  // loop through children of the node
  node?.children?.forEach((child) => {
    // add the number of all children for that child to count
    count = count + handleFinalPositionCalculation(child, count);
  });
  // return number of all children for that parent
  return node.numberOfAllChildren;
};

// function to handle position calculation
const handlePositionCalculation = (root) => {
  // reseting number of levels
  root.numberOfLevels = 1;
  handleNumberOfAllChildrenForThatParent(root, 1, root, null, 0);
  handleFinalPositionCalculation(root, 0);
};

export { handlePositionCalculation };
