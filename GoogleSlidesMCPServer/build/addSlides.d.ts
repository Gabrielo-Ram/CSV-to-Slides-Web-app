import { SlideType } from "./types.js";
/**
 * This function allows the user (or the LLM) to create a custom slide using
 * the functions defined above. The LLM will format a 'content' block and
 * place it into the new slide along with a custom title.
 *
 * @param {string} title The title of the custom slide.
 * @param {string} content The content placed inside the slide (formatted by the LLM)
 * @param {string} presentationId The ID of the presentation we want to add a slide to.
 * @param {SlideType} type The way the LLM identifies whether it wants to create a 'Paragraph' or a 'Bullet' slide
 */
export declare function addCustomSlide(title: string, content: string, presentationId: string, type: SlideType): Promise<void>;
