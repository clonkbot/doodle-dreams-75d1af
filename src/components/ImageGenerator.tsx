import { useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";

const PROMPT_SUGGESTIONS = [
  "A friendly dragon having a tea party",
  "A cat astronaut on the moon",
  "A magical treehouse in a forest",
  "A unicorn playing soccer",
  "A robot making pancakes",
  "A pirate ship made of candy",
  "A dinosaur learning to ride a bicycle",
  "A penguin in a superhero cape",
];

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateImage = useAction(api.ai.generateImage);
  const saveIllustration = useMutation(api.illustrations.save);
  const recentImages = useQuery(api.illustrations.listRecent, { limit: 4 });

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const enhancedPrompt = `Children's book illustration style, colorful and whimsical, friendly and cute: ${prompt}`;
      const result = await generateImage({ prompt: enhancedPrompt });

      if (result) {
        setGeneratedImage(result);
        await saveIllustration({
          prompt: prompt,
          imageBase64: result,
        });
      } else {
        setError("Oops! The magic didn't work this time. Try again!");
      }
    } catch (err) {
      setError("Something went wrong! Let's try a different idea.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Hero section */}
      <div className="text-center mb-6 md:mb-8">
        <h2 className="font-display text-3xl md:text-5xl text-charcoal mb-2 md:mb-3 wiggle-text">
          What shall we draw today?
        </h2>
        <p className="font-hand text-lg md:text-xl text-charcoal/70">
          Type your idea and watch the magic happen! ✨
        </p>
      </div>

      {/* Input section */}
      <div className="paper-card p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="flex-1">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A fluffy bunny eating rainbow ice cream..."
              className="crayon-input min-h-[80px] md:min-h-[100px] resize-none"
              disabled={isGenerating}
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="crayon-button bg-coral text-white hover:bg-coral/90 disabled:opacity-50 disabled:cursor-not-allowed md:self-stretch md:px-8"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin text-xl">🎨</span>
                <span className="hidden sm:inline">Creating...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>✨</span>
                <span>Draw It!</span>
              </span>
            )}
          </button>
        </div>

        {/* Suggestions */}
        <div className="mt-4 md:mt-6">
          <p className="font-hand text-base md:text-lg text-charcoal/60 mb-2 md:mb-3">Need ideas? Try these:</p>
          <div className="flex flex-wrap gap-2">
            {PROMPT_SUGGESTIONS.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(suggestion)}
                className="suggestion-chip"
                disabled={isGenerating}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="paper-card p-4 md:p-6 bg-coral/10 border-coral animate-shake">
          <p className="font-hand text-lg md:text-xl text-coral text-center">{error}</p>
        </div>
      )}

      {/* Loading state */}
      {isGenerating && (
        <div className="paper-card p-6 md:p-12">
          <div className="flex flex-col items-center justify-center space-y-4 md:space-y-6">
            <div className="relative w-32 h-32 md:w-48 md:h-48">
              <div className="absolute inset-0 bg-sunny/30 rounded-blob animate-pulse" />
              <div className="absolute inset-4 bg-sky/30 rounded-blob animate-pulse animation-delay-200" />
              <div className="absolute inset-8 bg-coral/30 rounded-blob animate-pulse animation-delay-400" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl md:text-6xl animate-bounce">🖍️</span>
              </div>
            </div>
            <p className="font-display text-xl md:text-2xl text-charcoal animate-pulse">
              Drawing your masterpiece...
            </p>
            <div className="flex gap-2">
              {["🌈", "⭐", "🎨", "✨", "🦋"].map((emoji, i) => (
                <span
                  key={i}
                  className="text-xl md:text-2xl animate-bounce"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Generated image */}
      {generatedImage && !isGenerating && (
        <div className="paper-card p-4 md:p-6 animate-pop-in">
          <div className="scrapbook-frame">
            <img
              src={`data:image/png;base64,${generatedImage}`}
              alt={prompt}
              className="w-full rounded-lg"
            />
          </div>
          <div className="mt-4 text-center">
            <p className="font-hand text-lg md:text-xl text-charcoal/80 mb-4">"{prompt}"</p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
              <button
                onClick={() => {
                  const link = document.createElement("a");
                  link.download = `doodle-${Date.now()}.png`;
                  link.href = `data:image/png;base64,${generatedImage}`;
                  link.click();
                }}
                className="crayon-button bg-mint text-charcoal"
              >
                💾 Save to Computer
              </button>
              <button
                onClick={() => {
                  setGeneratedImage(null);
                  setPrompt("");
                }}
                className="crayon-button bg-sky text-white"
              >
                🎨 Draw Another!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent creations */}
      {!isGenerating && !generatedImage && recentImages && recentImages.length > 0 && (
        <div className="mt-8 md:mt-12">
          <h3 className="font-display text-xl md:text-2xl text-charcoal mb-4">Your Recent Doodles</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {recentImages.map((img: Doc<"illustrations">) => (
              <div key={img._id} className="paper-card p-2 md:p-3 hover:rotate-1 transition-transform">
                <div className="aspect-square overflow-hidden rounded-lg border-2 border-dashed border-charcoal/20">
                  <img
                    src={`data:image/png;base64,${img.imageBase64}`}
                    alt={img.prompt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-hand text-xs md:text-sm text-charcoal/70 mt-2 line-clamp-2">{img.prompt}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
