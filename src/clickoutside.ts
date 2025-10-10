import type { Attachment } from "svelte/attachments";

export function clickOutside(handler: () => void): Attachment {  
  return element => {
    const handleClick = (e: MouseEvent) => {   
      if (!element.contains(e.target as Element)) {
        handler();
      }
      return () => {
        window.removeEventListener('click', handleClick);
      };
    };
    window.addEventListener('click', handleClick);
  };
}