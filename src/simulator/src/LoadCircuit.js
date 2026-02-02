// LoadCircuit.js
// Programmatic JSON → Circuit loader for CircuitVerse v0 engine
import { update, updateSimulationSet } from './engine'
import Input from "./modules/Input";
import Output from "./modules/Output";
import AndGate from "./modules/AndGate";
import XorGate from "./modules/XorGate";
import Wire from "./wire";

/**
 * Safely reset simulator state
 */
function resetScope(scope) {
    scope.Input?.splice(0);
    scope.Output?.splice(0);
    scope.AndGate?.splice(0);
    scope.XorGate?.splice(0);

    scope.nodes?.splice(0);
    scope.allNodes?.splice(0);
    scope.wires?.splice(0);

    scope.timeStamp = Date.now();
}

/**
 * ---- Element creators ----
 */
function createInput(x, y, label, scope, map, key) {
    const g = new Input(x, y, scope, "RIGHT", 1);
    if (label) g.setLabel(label);
    map[key] = g; // store the Input component itself

}

function createOutput(x, y, label, scope, map, key) {
    const g = new Output(x, y, scope, "LEFT", 1);
    if (label) g.setLabel(label);
    map[key] = g.inp1;
}

function createAndGate(data, scope, map) {
    const g = new AndGate(data.x, data.y, scope, "RIGHT", 2, 1);
    map[data.inp[0]] = g.inp[0];
    map[data.inp[1]] = g.inp[1];
    map[data.output1] = g.output1;
}

function createXorGate(data, scope, map) {
    const g = new XorGate(data.x, data.y, scope, "RIGHT", 2, 1);
    map[data.inp[0]] = g.inp[0];
    map[data.inp[1]] = g.inp[1];
    map[data.output1] = g.output1;
}

/**
 * ---- Wire builder ----
 */
function connectSignals(wire, map, scope) {
    const n1 = map[wire.node1];
    const n2 = map[wire.node2];

    if (!n1 || !n2) {
        console.warn("Invalid wire connection:", wire);
        return;
    }

    new Wire(n1, n2, scope);
}

/**
 * ---- MAIN API ----
 * Load a circuit from JSON
 */
export function LoadCircuit(json) {
       console.log('[LoadCircuit] called', json)
    const scope = globalScope;
    const signalMap = {};

    if (!scope) {
        console.error("globalScope not initialized");
        return;
    }

   // resetScope(scope);

    // Inputs
    json.Input?.forEach(i =>
        createInput(i.x, i.y, i.label, scope, signalMap, i.output)
    );


    // Outputs
    json.Output?.forEach(o =>
        createOutput(o.x, o.y, o.label, scope, signalMap, o.input)
    );

    // Gates
    json.XorGate?.forEach(g =>
        createXorGate(g, scope, signalMap)
    );

    json.AndGate?.forEach(g =>
        createAndGate(g, scope, signalMap)
    );

    // Wires
    json.wires?.forEach(w =>
        connectSignals(w, signalMap, scope)
    );

  json.Input?.forEach(i => {
    const input = signalMap[i.output]
    if (input) {
        input.setValue(0)   // ✅ THIS is the real fix
    }
})

updateSimulationSet(true)
    console.log('[LoadCircuit] nodes:', scope.nodes.length)

scope.timeStamp = Date.now()
update()


    console.log("Circuit loaded from JSON");
}
