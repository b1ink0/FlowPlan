use serde_json::Value;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;

#[wasm_bindgen]
pub fn get_position(json_str: &str) -> Result<String, JsValue> {
    // Parse the JSON string into a serde_json::Value
    let mut parsed_json: Value = serde_json::from_str(json_str)
        .map_err(|e| JsValue::from_str(&format!("Error parsing JSON: {}", e)))?;

    // Process the JSON data dynamically.
    // You can access and manipulate the data using serde_json's methods.

    handle_position_calculation(&mut parsed_json);

    // For example, you can serialize it back to a formatted JSON string.
    let result_json_str = serde_json::to_string_pretty(&parsed_json)
        .map_err(|e| JsValue::from_str(&format!("Error serializing JSON: {}", e)))?;

    Ok(result_json_str)
}

pub fn handle_position_calculation(root: &mut Value) {
    // Initialize the number of levels to 1
    let mut number_of_levels = 1;
    // Perform calculations for the number of all children and final positions
    let _ = handle_number_of_all_children_for_that_parent(root, 1, &mut number_of_levels);
    let _ = handle_final_position_calculation(root, 0);
}

// Calculate the number of all children for a given parent node
fn handle_number_of_all_children_for_that_parent(
    node: &mut Value,
    i: u64,
    number_of_levels: &mut u64,
) -> u64 {
    // If the node has no children or the node is not expanded,
    // then the number of all children for that parent is 1
    if node["children"]
        .as_array()
        .map_or(false, |children| children.is_empty())
        || !node["expanded"].as_bool().unwrap_or(true)
    {
        node["numberOfAllChildren"] = Value::Number(serde_json::Number::from(1));
        // Update the number of levels if the current level is greater
        if i > *number_of_levels {
            *number_of_levels = i;
        }
        return 1;
    }
    // Initialize count
    let mut count = 0;
    // Loop through children of the node
    if let Some(children) = node["children"].as_array_mut() {
        for child in children {
            // Recursively add the number of all children for that child to count
            count += handle_number_of_all_children_for_that_parent(child, i + 1, number_of_levels);
        }
    }
    // Update the number of children for that parent
    node["numberOfAllChildren"] = Value::Number(serde_json::Number::from(count));
    // Return the count
    count
}

// Calculate the final position of nodes within the tree
fn handle_final_position_calculation(node: &mut Value, i: u64) -> u64 {
    let mut count = i;
    // Calculate the final position of the node as the number of all children for that parent / 2 + i
    if let Some(number_of_all_children) = node["numberOfAllChildren"].as_u64() {
        node["fp"] = Value::Number(
            serde_json::Number::from_f64(number_of_all_children as f64 / 2.0 + i as f64).unwrap(),
        );
    }
    // Loop through children of the node
    if let Some(children) = node["children"].as_array_mut() {
        for child in children {
            // Recursively add the number of all children for that child to count
            count = count + handle_final_position_calculation(child, count);
        }
    }
    // Return the number of all children for that parent
    node["numberOfAllChildren"].as_u64().unwrap_or(0)
}
