import { http, HttpResponse } from 'msw';
import { generateMockItem } from './mockData';

const totalItems = 50;
const allMockItems = Array.from({ length: totalItems }, (_, index) =>
  generateMockItem(index)
);

export const handlers = [
  http.get('/api/items', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 10;
    const search = url.searchParams.get('search') || '';

    let filteredItems = allMockItems;
    if (search) {
      filteredItems = filteredItems.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.status.toLowerCase().includes(search.toLowerCase()) ||
          item.createdBy.toLowerCase().includes(search.toLowerCase())
      );
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedItems = filteredItems.slice(start, end);

    return HttpResponse.json({
      items: paginatedItems,
      hasMore: end < filteredItems.length,
      totalCount: filteredItems.length,
    });
  }),

  http.delete('/api/items/:id', ({ params }) => {
    const { id } = params;
    return HttpResponse.json({ success: true, deletedId: id });
  }),
];
