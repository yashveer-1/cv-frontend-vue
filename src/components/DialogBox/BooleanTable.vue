<template>
    <table class="content-table">
        <tbody style="display: block; max-height: 70vh; overflow-y: auto;">
            <tr>
                <th v-for="tableHeading in tableHeader" :key="tableHeading">
                    {{ tableHeading }}
                </th>
            </tr>
            <tr v-for="(tableRow, rowIdx) in tableBody" :key="rowIdx">
                <!--
                    Input columns (indices < inputColCount) are read-only.
                    Output columns (indices >= inputColCount) are editable by clicking.
                    Clicking cycles: 'x' -> 0 -> 1 -> 'x'
                -->
                <td
                    v-for="(tableElement, colIdx) in tableRow"
                    :key="colIdx"
                    :class="{
                        'cell-editable': colIdx >= inputColCount,
                        'cell-x': tableElement === 'x',
                        'cell-one': tableElement === 1,
                        'cell-zero': tableElement === 0,
                    }"
                    @click="colIdx >= inputColCount && cycleCell(rowIdx, colIdx)"
                >
                    {{ tableElement }}
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
    tableHeader: { type: Array, default: () => [] },
    tableBody: { type: Array, default: () => [] },
    inputColCount: { type: Number, default: 0 },
})

const emit = defineEmits(['update:tableBody'])

/**
 * Cycle a cell's value: 'x' -> 0 -> 1 -> 'x'
 * Emits the mutated copy so the parent can update its reactive tableBody.
 */
function cycleCell(rowIdx: number, colIdx: number) {
    const newBody = props.tableBody.map((row: any[]) => [...row])
    const cur = newBody[rowIdx][colIdx]
    if (cur === 'x') {
        newBody[rowIdx][colIdx] = 0
    } else if (cur === 0) {
        newBody[rowIdx][colIdx] = 1
    } else {
        newBody[rowIdx][colIdx] = 'x'
    }
    emit('update:tableBody', newBody)
}
</script>

<style scoped>
.cell-editable {
    cursor: pointer;
    user-select: none;
    font-weight: bold;
    transition: background-color 0.15s ease;
}
.cell-editable:hover {
    background-color: rgba(100, 149, 237, 0.2);
}
.cell-x {
    color: #888;
}
.cell-one {
    color: #4caf50;
}
.cell-zero {
    color: #f44336;
}
</style>
