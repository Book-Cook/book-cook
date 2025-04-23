import { useQuery } from '@tanstack/react-query';
import DOMPurify from 'dompurify';

export const useCheckFullyShared = (ownerEmail: string | undefined | null, currentUserEmail: string | undefined | null) => {
  return useQuery({
    queryKey: ['sharedAccess', ownerEmail, currentUserEmail],
    queryFn: async () => {
      if (!ownerEmail || !currentUserEmail) {
        return false;
      }
      const sanitizedOwnerEmail = DOMPurify.sanitize(ownerEmail);
      const sanitizedCurrentUserEmail = DOMPurify.sanitize(currentUserEmail);
      const response = await fetch(`/api/user/sharedWithUsers?owner=${encodeURIComponent(sanitizedOwnerEmail)}&user=${encodeURIComponent(sanitizedCurrentUserEmail)}`);
      if (!response.ok) {
        return false;
      }
      const data = await response.json();
      return data.hasAccess;
    },
    enabled: Boolean(ownerEmail) && Boolean(currentUserEmail)
  });
};
