import {
  chocolateChipCookies,
  thaiGreenCurry,
  caesarSalad,
} from "../../data/recipes";

/**
 * GET /api/recipes responses
 */
export const GetRecipesResponses = {
  success: {
    empty: [],
    withResults: [chocolateChipCookies, thaiGreenCurry, caesarSalad],
    filtered: [chocolateChipCookies],
    sorted: {
      byTitleAsc: [
        { ...chocolateChipCookies, title: "Apple Pie" },
        { ...thaiGreenCurry, title: "Beef Stew" },
        { ...caesarSalad, title: "Chocolate Cake" },
      ],
      byDateDesc: [
        { ...caesarSalad, createdAt: "2024-03-01T00:00:00.000Z" },
        { ...chocolateChipCookies, createdAt: "2024-02-01T00:00:00.000Z" },
        { ...thaiGreenCurry, createdAt: "2024-01-01T00:00:00.000Z" },
      ],
    },
  },

  errors: {
    invalidSort: {
      message: "Invalid sorting parameters.",
      status: 400,
    },
    unauthorized: {
      message: "Unauthorized",
      status: 401,
    },
    serverError: {
      message: "Internal Server Error",
      status: 500,
    },
  },
};
