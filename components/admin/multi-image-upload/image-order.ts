export function getAdjustedPrimaryIndexAfterRemoval(
    currentPrimaryIndex: number,
    removedIndex: number,
    nextLength: number,
) {
    if (currentPrimaryIndex >= nextLength) {
        return Math.max(0, nextLength - 1)
    }

    if (removedIndex < currentPrimaryIndex) {
        return currentPrimaryIndex - 1
    }

    return currentPrimaryIndex
}

export function reorderImages(images: string[], fromIndex: number, toIndex: number) {
    const nextImages = [...images]
    const [removed] = nextImages.splice(fromIndex, 1)
    nextImages.splice(toIndex, 0, removed)
    return nextImages
}

export function getAdjustedPrimaryIndexAfterReorder(
    currentPrimaryIndex: number,
    fromIndex: number,
    toIndex: number,
) {
    if (fromIndex === currentPrimaryIndex) return toIndex
    if (fromIndex < currentPrimaryIndex && toIndex >= currentPrimaryIndex) return currentPrimaryIndex - 1
    if (fromIndex > currentPrimaryIndex && toIndex <= currentPrimaryIndex) return currentPrimaryIndex + 1
    return currentPrimaryIndex
}
