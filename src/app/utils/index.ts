export function updateItemById<T extends {id: number}>(array: T[], newItem: T): T[] {
    const index = array.findIndex(item=> item.id === newItem.id)
    return [
        ...array.slice(0, index),
        newItem,
        ...array.slice()
    ]
}