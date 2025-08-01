import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Camera, X, Check } from "lucide-react";

interface PhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoChange: (photoUrl: string | null) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function PhotoUpload({
  currentPhotoUrl,
  onPhotoChange,
  className = "",
  size = "md",
}: PhotoUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
  };

  const validateFile = (file: File): string | null => {
    // Vérifier le type de fichier
    if (!file.type.startsWith("image/")) {
      return "Veuillez sélectionner un fichier image valide.";
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return "La taille du fichier ne doit pas dépasser 5 MB.";
    }

    // Vérifier les formats supportés
    const supportedFormats = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    if (!supportedFormats.includes(file.type)) {
      return "Formats supportés : JPEG, PNG, WebP.";
    }

    return null;
  };

  const handleFileUpload = async (file: File) => {
    setError(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);

    try {
      // Créer une URL locale pour prévisualisation et conserver le chemin local
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        // Stocker à la fois l'image base64 et le chemin local
        const photoData = {
          base64: result,
          localPath: file.name,
          fullPath: file.webkitRelativePath || file.name
        };
        onPhotoChange(JSON.stringify(photoData));
        setUploading(false);
      };
      reader.readAsDataURL(file);

      // En production, ici on uploaderait vers un service de stockage
      // const formData = new FormData();
      // formData.append('photo', file);
      // const response = await fetch('/api/upload-photo', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const { url } = await response.json();
      // onPhotoChange(url);
    } catch (err) {
      setError("Erreur lors du téléchargement de la photo.");
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const removePhoto = () => {
    onPhotoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-4">
        {/* Avatar avec photo actuelle */}
        <Avatar
          className={`${sizeClasses[size]} ${currentPhotoUrl ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
          onClick={() => {
            if (currentPhotoUrl) {
              alert(`Chemin de la photo:\n${currentPhotoUrl}`);
            }
          }}
        >
          {currentPhotoUrl ? (
            <AvatarImage src={currentPhotoUrl} alt="Photo officier" />
          ) : (
            <AvatarFallback>
              <Camera className="h-6 w-6 text-muted-foreground" />
            </AvatarFallback>
          )}
        </Avatar>

        {/* Zone de upload */}
        <Card
          className={`flex-1 cursor-pointer transition-colors ${
            dragOver ? "border-primary bg-primary/5" : "border-dashed"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="p-4">
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="text-sm">
                <span className="font-medium text-primary">
                  Cliquez pour choisir
                </span>
                <span className="text-muted-foreground">
                  {" "}
                  ou glissez une photo ici
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                JPEG, PNG, WebP - Max 5MB
              </div>
            </div>
          </CardContent>
        </Card>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Actions */}
      {currentPhotoUrl && (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={removePhoto}
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4 mr-1" />
            Supprimer
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-1" />
            Changer
          </Button>
        </div>
      )}

      {/* États */}
      {uploading && (
        <Alert>
          <Upload className="h-4 w-4" />
          <AlertDescription>
            Téléchargement de la photo en cours...
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {currentPhotoUrl && !uploading && !error && (
        <Alert>
          <Check className="h-4 w-4" />
          <AlertDescription>Photo téléchargée avec succès</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
