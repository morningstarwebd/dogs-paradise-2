import { getTypeIcon, isExternalUrl } from './link-picker-utils'
import type { LinkOption } from './link-picker-types'

interface LinkPickerDropdownProps {
    currentExternalValue: LinkOption | null
    filteredOptions: LinkOption[]
    onSelect: (url: string) => void
}

export function LinkPickerDropdown({
    currentExternalValue,
    filteredOptions,
    onSelect,
}: LinkPickerDropdownProps) {
    if (filteredOptions.length === 0 && !currentExternalValue) {
        return (
            <div className="absolute mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 max-h-[300px] overflow-y-auto">
                <div className="px-4 py-6 text-center text-sm text-gray-500">
                    No matching pages or links found.
                </div>
            </div>
        )
    }

    return (
        <div className="absolute mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 max-h-[300px] overflow-y-auto">
            <ul className="py-2">
                {filteredOptions.map((option, index) => (
                    <li key={`${option.url}-${index}`}>
                        <button
                            type="button"
                            onClick={() => onSelect(option.url)}
                            className="w-full flex justify-between items-center px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                        >
                            <div className="flex items-center gap-3 w-full overflow-hidden">
                                <div className="shrink-0">{getTypeIcon(option.type)}</div>
                                <div className="truncate flex-1">
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{option.label}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate font-mono">{option.url}</div>
                                </div>
                            </div>
                        </button>
                    </li>
                ))}
                {currentExternalValue && filteredOptions.every((option) => option.url !== currentExternalValue.url) && (
                    <li key="external">
                        <button
                            type="button"
                            onClick={() => onSelect(currentExternalValue.url)}
                            className="w-full flex justify-between items-center px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left border-t border-gray-100 dark:border-gray-800"
                        >
                            <div className="flex items-center gap-3 w-full overflow-hidden">
                                <div className="shrink-0">{getTypeIcon('external')}</div>
                                <div className="truncate flex-1">
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">Link to &quot;{currentExternalValue.label}&quot;</div>
                                    {!isExternalUrl(currentExternalValue.url) && !currentExternalValue.url.startsWith('/') && (
                                        <div className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                                            Make sure the link includes http:// or https://
                                        </div>
                                    )}
                                </div>
                            </div>
                        </button>
                    </li>
                )}
            </ul>
        </div>
    )
}
