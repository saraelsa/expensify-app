import {useEffect} from 'react';
import KeyboardShortcut from '@libs/KeyboardShortcut';
import CONST from '@src/CONST';

/**
 * Register a keyboard shortcut handler.
 * Recommendation: To ensure stability, wrap the `callback` function with the useCallback hook before using it with this hook.
 *
 * @param {Object} shortcut
 * @param {Function} callback
 * @param {Object} [config]
 */
export default function useKeyboardShortcut(shortcut, callback, config = {}) {
    const {
        captureOnInputs = true,
        shouldBubble = false,
        priority = 0,
        shouldPreventDefault = true,

        // The "excludedNodes" array needs to be stable to prevent the "useEffect" hook from being recreated unnecessarily.
        // Hence the use of CONST.EMPTY_ARRAY.
        excludedNodes = CONST.EMPTY_ARRAY,
        isActive = true,
    } = config;

    useEffect(() => {
        if (isActive) {
            return KeyboardShortcut.subscribe(
                shortcut.shortcutKey,
                callback,
                shortcut.descriptionKey,
                shortcut.modifiers,
                captureOnInputs,
                shouldBubble,
                priority,
                shouldPreventDefault,
                excludedNodes,
            );
        }
        return () => {};
    }, [isActive, callback, captureOnInputs, excludedNodes, priority, shortcut.descriptionKey, shortcut.modifiers, shortcut.shortcutKey, shouldBubble, shouldPreventDefault]);
}
