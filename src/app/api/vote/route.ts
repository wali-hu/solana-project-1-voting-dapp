import { ActionGetResponse, ACTIONS_CORS_HEADERS } from "@solana/actions";

export const OPTIONS = GET;

export async function GET(request: Request) {
  const actionMetadata: ActionGetResponse = {
    icon: "https://assets.tmecosys.com/image/upload/t_web767x639/img/recipe/ras/Assets/1FB4CC95-9604-4B9F-8392-1CC11636192B/Derivates/698118cd-d2c0-477b-bca9-3700010291d3.jpg",
    title: "Vote for your favorite type of peanut butter!",
    description: "Vote between crunchy and smooth peanut butter.",
    label: "Vote",
    links: {
      actions: [
        {
          label: "Vote for Crunchy",
          href: "'http://localhost:3000/api/vote?candidate=crunchy",
          type: "post",
        },
        {
          label: "Vote for Smooth",
          href: "http://localhost:3000/api/vote?candidate=smooth",
          type: "post",
        },
      ],
    },
  };

  return Response.json(actionMetadata, { headers: ACTIONS_CORS_HEADERS });
}
