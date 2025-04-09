
import { Asset } from "@/lib/types";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ConnectedAssetProps {
  connectedAssetId: string;
}

export default function ConnectedAsset({ connectedAssetId }: ConnectedAssetProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Verbundenes Asset</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-sm">
          <p className="text-muted-foreground">ID: {connectedAssetId}</p>
          <Button variant="link" size="sm" className="p-0 h-auto mt-1" asChild>
            <Link to={`/asset/${connectedAssetId}`}>
              Verbundenes Asset anzeigen
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
