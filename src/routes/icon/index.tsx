// TanStack Router
import { createFileRoute } from '@tanstack/react-router';

// Open Graph Image Generation
import { ImageResponse } from '@vercel/og';

// favicon
export const Route = createFileRoute('/icon/')({
  server: {
    handlers: {
      GET() {
        return new ImageResponse(
          (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                paddingTop: '2px',
                fontSize: 28,
              }}
            >
              🌸
            </div>
          ),
          { width: 32, height: 32 },
        );
      },
    },
  },
});
