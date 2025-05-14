
import { useEffect, useState } from "react";
import { Document } from "./types";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { File, FileImage, FileText, FileVideo, FileAudio } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DocumentPreviewProps {
  document: Document;
}

export function DocumentPreview({ document }: DocumentPreviewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
  }, [document]);

  // Determine document type for rendering
  const isImage = document.type.startsWith("image/");
  const isPDF = document.type === "application/pdf";
  const isVideo = document.type.startsWith("video/");
  const isAudio = document.type.startsWith("audio/");

  const getDocumentIcon = () => {
    if (isImage) return <FileImage size={64} className="text-primary opacity-40" />;
    if (isPDF) return <FileText size={64} className="text-primary opacity-40" />;
    if (isVideo) return <FileVideo size={64} className="text-primary opacity-40" />;
    if (isAudio) return <FileAudio size={64} className="text-primary opacity-40" />;
    return <File size={64} className="text-primary opacity-40" />;
  };

  // Handle PDF viewing
  if (isPDF) {
    return (
      <div className="h-full w-full bg-background relative">
        <iframe
          src={`${document.url}#view=FitH`}
          className="w-full h-full min-h-[500px]"
          title={document.name}
          onLoad={() => setLoading(false)}
          onError={() => setError("Fehler beim Laden des PDF-Dokuments")}
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Skeleton className="w-full h-[500px]" />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="text-center p-4">
              <FileText size={48} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{error}</p>
              <a 
                href={document.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-2 text-sm text-primary hover:underline"
              >
                Dokument in neuem Tab öffnen
              </a>
            </div>
          </div>
        )}

        {document.description && !loading && !error && (
          <div className="absolute top-2 left-2 right-2 bg-background/80 p-2 rounded-md border text-sm">
            <p>{document.description}</p>
            {document.tags && document.tags.length > 0 && (
              <div className="flex gap-1 mt-1 flex-wrap">
                {document.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-primary/10">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Handle image viewing
  if (isImage) {
    return (
      <div className="relative bg-secondary/20 rounded-md overflow-hidden">
        <AspectRatio ratio={16 / 9} className="bg-muted">
          <img
            src={document.url}
            alt={document.name}
            className="object-contain w-full h-full"
            onLoad={() => setLoading(false)}
            onError={() => setError("Fehler beim Laden des Bildes")}
          />
        </AspectRatio>
        
        {loading && <Skeleton className="absolute inset-0" />}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="text-center p-4">
              <FileImage size={48} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        )}

        {document.description && !loading && !error && (
          <div className="absolute bottom-2 left-2 right-2 bg-background/80 p-2 rounded-md border">
            <p className="text-sm">{document.description}</p>
            {document.tags && document.tags.length > 0 && (
              <div className="flex gap-1 mt-1 flex-wrap">
                {document.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-primary/10 text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Handle video viewing
  if (isVideo) {
    return (
      <div className="relative bg-secondary/20 rounded-md overflow-hidden">
        <video 
          src={document.url} 
          controls 
          className="w-full h-auto max-h-[500px]"
          onLoadedData={() => setLoading(false)}
          onError={() => setError("Fehler beim Laden des Videos")}
        >
          Ihr Browser unterstützt das Video-Tag nicht.
        </video>
        
        {loading && <Skeleton className="absolute inset-0" />}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="text-center p-4">
              <FileVideo size={48} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        )}

        {document.description && !loading && !error && (
          <div className="p-3 bg-muted/20 border-t text-sm">
            <p>{document.description}</p>
            {document.tags && document.tags.length > 0 && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {document.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-primary/10">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Handle audio preview
  if (isAudio) {
    return (
      <div className="relative bg-secondary/20 rounded-md p-4">
        <audio 
          src={document.url} 
          controls 
          className="w-full"
          onLoadedData={() => setLoading(false)}
          onError={() => setError("Fehler beim Laden der Audiodatei")}
        >
          Ihr Browser unterstützt das Audio-Tag nicht.
        </audio>
        
        {loading && <Skeleton className="h-12 w-full" />}
        
        {error && (
          <div className="p-4 text-center">
            <FileAudio size={48} className="mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        )}

        {document.description && !loading && !error && (
          <div className="mt-3 p-3 bg-muted/20 rounded-md border text-sm">
            <p>{document.description}</p>
            {document.tags && document.tags.length > 0 && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {document.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-primary/10">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Fallback for other document types
  return (
    <div className="h-[300px] flex flex-col items-center justify-center text-center p-4">
      {getDocumentIcon()}
      <p className="text-sm text-muted-foreground mt-4">
        Vorschau nicht verfügbar für diesen Dateityp
      </p>
      <a 
        href={document.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="mt-2 text-sm text-primary hover:underline"
      >
        In neuem Tab öffnen
      </a>
      
      {document.description && (
        <div className="mt-4 p-3 bg-muted/20 rounded-md border text-sm max-w-md w-full">
          <p>{document.description}</p>
          {document.tags && document.tags.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {document.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-primary/10">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
