/**
 * @fileoverview Rule to forbid control characters from regular expressions.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    /**
     * Reports the rule if the node's value has control characters
     * @param {ASTNode} node the AST node
     * @returns {undefined}
     */
    function reportIfHasControlChars(node) {
        if (/[\x00-\x1f]/.test(node.value.toString())) {
            context.report(node, "Unexpected control character in regular expression.");
        }
    }

    /**
     * Gets a NewExpression or CallExpression node, and reports if it creates a RegExp that has control characters.
     * @param {ASTNode} node the CallExpression or NewExpression
     * @returns {undefined}
     */
    function handleRegExpConstructor(node) {
        if (node.callee.type === "Identifier" && node.callee.name === "RegExp" && node.arguments) {
            reportIfHasControlChars(node.arguments[0]);
        }
    }

    return {
        "Literal": function(node) {
            if (node.value instanceof RegExp) {
                reportIfHasControlChars(node);
            }
        },
        "NewExpression": handleRegExpConstructor,
        "CallExpression": handleRegExpConstructor
    };

};

module.exports.schema = [];
