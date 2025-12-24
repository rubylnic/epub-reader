import { useCallback, useLayoutEffect, useState } from 'react';

function useElementHeight<T extends HTMLElement>(isEpub:boolean) {
    const [node, setNode] = useState<T | null>(null);
    const [height, setHeight] = useState(0);
    if (isEpub) return [null, 0];

    const ref = useCallback((el: T | null) => {
        setNode(el);
    }, []);

    useLayoutEffect(() => {
        if (!node) return;
        const update = () => {
            const w = Math.round(node.getBoundingClientRect().height);
            setHeight(w);
        };

        update();
        const ro = new ResizeObserver(update);
        ro.observe(node);
        window.addEventListener('resize', update);

        return () => {
            ro.disconnect();
            window.removeEventListener('resize', update);
        };
    }, [node]);

    return [ref, height] as const;
}

export default useElementHeight;