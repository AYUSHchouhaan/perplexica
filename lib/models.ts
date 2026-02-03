import { Gemini as GeminiIcon, OpenAI as OpenAIIcon, Claude as ClaudeIcon, Meta as MetaIcon, DeepSeek as DeepSeekIcon, Grok as GrokIcon, Qwen as QwenIcon } from "@lobehub/icons";
import { ComponentType, SVGProps } from "react";

export interface Model {
  id?: string;
  name: string;
  logo: ComponentType<SVGProps<SVGSVGElement>>;
  info: string;
  capabilities: string[];
  favorite: boolean;
  premium: boolean;
  active: boolean;
}

export const rawModels: Record<string, Omit<Model, "id">> = {
  "Gemini 2.5 Flash": { name: "Gemini 2.5 Flash", logo: GeminiIcon, info: "Google's latest fast model", capabilities: ["vision", "web", "pdf"], favorite: true, premium: false, active: true },
  "GPT-OSS 120B": { name: "GPT-OSS 120B", logo: OpenAIIcon, info: "OpenAI GPT-OSS 120B", capabilities: ["reasoning"], favorite: true, premium: false, active: true },
  "GPT-4o": { name: "GPT-4o", logo: OpenAIIcon, info: "OpenAI's GPT-4o via OpenRouter", capabilities: ["vision"], favorite: true, premium: false, active: true },
  "Claude 3.5 Sonnet": { name: "Claude 3.5 Sonnet", logo: ClaudeIcon, info: "Anthropic's flagship via OpenRouter", capabilities: ["vision", "pdf"], favorite: true, premium: false, active: true },
  "DeepSeek Chat": { name: "DeepSeek Chat", logo: DeepSeekIcon, info: "DeepSeek Chat via OpenRouter", capabilities: ["reasoning"], favorite: true, premium: false, active: true },
  "Gemini 2 Flash Thinking": { name: "Gemini 2 Flash Thinking", logo: GeminiIcon, info: "Google's thinking model (Free)", capabilities: ["reasoning"], favorite: true, premium: false, active: true },
  "Llama 3.3 70b": { name: "Llama 3.3 70b", logo: MetaIcon, info: "Meta's Llama 3.3 70b on Groq", capabilities: [], favorite: true, premium: false, active: true },
  "Llama 4 Maverick": { name: "Llama 4 Maverick", logo: MetaIcon, info: "Meta's Llama 4 Maverick on Groq", capabilities: [], favorite: true, premium: false, active: true },
  "Qwen qwq-32b": { name: "Qwen qwq-32b", logo: QwenIcon, info: "Qwen base 32b on Groq", capabilities: ["reasoning"], favorite: true, premium: false, active: true },
  "DeepSeek R1 (Llama Distilled)": { name: "DeepSeek R1 (Llama Distilled)", logo: DeepSeekIcon, info: "DeepSeek R1 on Groq, distilled on Llama 3.3 70b", capabilities: ["reasoning"], favorite: true, premium: false, active: true },
  "Gemini 2.5 Pro": { name: "Gemini 2.5 Pro", logo: GeminiIcon, info: "Google's newest experimental model", capabilities: ["vision", "web", "pdf", "reasoning"], favorite: true, premium: false, active: false },
};

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[\s.()]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const models: Model[] = Object.entries(rawModels).map(([name, def]) => ({
  id: slugify(name),
  ...def,
}));
