
import { NavigateFunction } from "react-router-dom";
import { SearchResult } from "./types";

export class NavigationUtils {
  static handleResultClick(result: SearchResult, navigate: NavigateFunction, onClose: () => void) {
    switch (result.type) {
      case 'asset':
        navigate(`/assets/${result.id}`);
        break;
      case 'employee':
        navigate(`/employees/${result.id}`);
        break;
      case 'document':
        if (result.metadata?.assetId) {
          navigate(`/assets/${result.metadata.assetId}`);
        }
        break;
    }
    onClose();
  }
}
