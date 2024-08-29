export function createOption(id, value, text) {
    const defaultOption = document.createElement('option')
    defaultOption.id = id
    defaultOption.value = value
    defaultOption.textContent = text
    return defaultOption
  }