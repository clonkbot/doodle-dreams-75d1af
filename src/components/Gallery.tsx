import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id, Doc } from "../../convex/_generated/dataModel";

export function Gallery() {
  const illustrations = useQuery(api.illustrations.list);
  const removeIllustration = useMutation(api.illustrations.remove);
  const [selectedImage, setSelectedImage] = useState<{
    id: Id<"illustrations">;
    imageBase64: string;
    prompt: string;
  } | null>(null);
  const [deletingId, setDeletingId] = useState<Id<"illustrations"> | null>(null);

  const handleDelete = async (id: Id<"illustrations">) => {
    if (deletingId) return;
    setDeletingId(id);
    try {
      await removeIllustration({ id });
      if (selectedImage?.id === id) {
        setSelectedImage(null);
      }
    } catch (err) {
      console.error("Failed to delete:", err);
    } finally {
      setDeletingId(null);
    }
  };

  if (illustrations === undefined) {
    return (
      <div className="flex items-center justify-center py-16 md:py-20">
        <div className="text-center">
          <div className="text-5xl md:text-6xl animate-bounce mb-4">🖼️</div>
          <p className="font-display text-xl md:text-2xl text-charcoal">Loading your gallery...</p>
        </div>
      </div>
    );
  }

  if (illustrations.length === 0) {
    return (
      <div className="paper-card p-8 md:p-12 text-center">
        <div className="text-6xl md:text-8xl mb-4 md:mb-6">🎨</div>
        <h3 className="font-display text-2xl md:text-3xl text-charcoal mb-2">Your gallery is empty!</h3>
        <p className="font-hand text-lg md:text-xl text-charcoal/70">
          Start creating some magical illustrations and they'll appear here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-6 md:mb-8">
        <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-2">Your Art Gallery</h2>
        <p className="font-hand text-lg md:text-xl text-charcoal/70">
          {illustrations.length} magical creation{illustrations.length !== 1 ? "s" : ""} ✨
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {illustrations.map((img: Doc<"illustrations">, index: number) => (
          <div
            key={img._id}
            className="paper-card p-2 md:p-3 gallery-item cursor-pointer group"
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => setSelectedImage({ id: img._id, imageBase64: img.imageBase64, prompt: img.prompt })}
          >
            <div className="relative aspect-square overflow-hidden rounded-lg border-2 border-dashed border-charcoal/20">
              <img
                src={`data:image/png;base64,${img.imageBase64}`}
                alt={img.prompt}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/10 transition-colors" />
            </div>
            <p className="font-hand text-xs md:text-sm text-charcoal/70 mt-2 line-clamp-2">{img.prompt}</p>
            <p className="font-hand text-[10px] md:text-xs text-charcoal/40 mt-1">
              {new Date(img.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* Lightbox modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-charcoal/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="paper-card max-w-3xl w-full max-h-[90vh] overflow-y-auto p-4 md:p-6 animate-pop-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="scrapbook-frame">
              <img
                src={`data:image/png;base64,${selectedImage.imageBase64}`}
                alt={selectedImage.prompt}
                className="w-full rounded-lg"
              />
            </div>
            <p className="font-hand text-lg md:text-xl text-charcoal/80 mt-4 text-center">"{selectedImage.prompt}"</p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center mt-4">
              <button
                onClick={() => {
                  const link = document.createElement("a");
                  link.download = `doodle-${Date.now()}.png`;
                  link.href = `data:image/png;base64,${selectedImage.imageBase64}`;
                  link.click();
                }}
                className="crayon-button bg-mint text-charcoal"
              >
                💾 Save to Computer
              </button>
              <button
                onClick={() => handleDelete(selectedImage.id)}
                disabled={deletingId === selectedImage.id}
                className="crayon-button bg-coral text-white disabled:opacity-50"
              >
                {deletingId === selectedImage.id ? "🗑️ Deleting..." : "🗑️ Delete"}
              </button>
              <button
                onClick={() => setSelectedImage(null)}
                className="crayon-button bg-sky text-white"
              >
                ✖️ Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
