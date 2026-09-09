import { Hono } from 'hono';
import { getDashboardStats } from '../../services/adminService.js';
import { getAnalytics } from '../../services/adminAnalyticsService.js';
import {
  listAdminGames,
  getAdminGame,
  createAdminGame,
  updateAdminGame,
  deleteAdminGame,
} from '../../services/adminGamesService.js';
import {
  listAdminCategories,
  getAdminCategory,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from '../../services/adminCategoriesService.js';
import {
  listAdminCollections,
  getAdminCollection,
  createAdminCollection,
  updateAdminCollection,
  deleteAdminCollection,
  listAllGamesForPicker,
} from '../../services/adminCollectionsService.js';
import {
  listAdminGuides,
  listAdminFixes,
  getAdminGuide,
  getAdminFix,
  createAdminGuide,
  createAdminFix,
  updateAdminGuide,
  updateAdminFix,
  deleteAdminArticle,
} from '../../services/adminArticlesService.js';
import {
  listAdminUsers,
  getAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from '../../services/adminUsersService.js';
import {
  listAdminReports,
  getAdminReport,
  updateAdminReportStatus,
  deleteAdminReport,
} from '../../services/adminReportsService.js';
import {
  listAdminUnbanRequests,
  getAdminUnbanRequest,
  reviewAdminUnbanRequest,
  deleteAdminUnbanRequest,
} from '../../services/adminUnbanRequestsService.js';
import {
  listAdminSuggestions,
  getAdminSuggestion,
  reviewAdminSuggestion,
  deleteAdminSuggestion,
} from '../../services/adminSuggestionsService.js';
import {
  getAdminSteamFreeContent,
  updateSteamFreeVideoUrl,
  createSteamFreeStep,
  updateSteamFreeStep,
  deleteSteamFreeStep,
} from '../../services/adminSteamFreeService.js';

export const adminRoutes = new Hono();

/* Dashboard & Analytics */
adminRoutes.get('/dashboard', async (c) => {
  const stats = await getDashboardStats();
  return c.json({ success: true, message: 'Dashboard stats fetched', data: stats });
});

adminRoutes.get('/analytics', async (c) => {
  const analytics = await getAnalytics(c.req.query());
  return c.json({ success: true, data: analytics });
});

/* Games */
adminRoutes.get('/games/picker', async (c) => {
  const games = await listAllGamesForPicker();
  return c.json({ success: true, data: games });
});

adminRoutes.get('/games', async (c) => {
  const result = await listAdminGames(c.req.query());
  return c.json({ success: true, data: result });
});

adminRoutes.get('/games/:id', async (c) => {
  const { id } = c.req.param();
  const result = await getAdminGame(id);
  return c.json({ success: true, data: result });
});

adminRoutes.post('/games', async (c) => {
  const body = await c.req.json();
  const result = await createAdminGame(body);
  return c.json({ success: true, data: result });
});

adminRoutes.patch('/games/:id', async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const result = await updateAdminGame(id, body);
  return c.json({ success: true, data: result });
});

adminRoutes.delete('/games/:id', async (c) => {
  const { id } = c.req.param();
  await deleteAdminGame(id);
  return c.json({ success: true, message: 'Game deleted' });
});

/* Categories */
adminRoutes.get('/categories', async (c) => {
  const data = await listAdminCategories();
  return c.json({ success: true, data });
});

adminRoutes.get('/categories/:id', async (c) => {
  const { id } = c.req.param();
  const data = await getAdminCategory(id);
  return c.json({ success: true, data });
});

adminRoutes.post('/category', async (c) => {
  const body = await c.req.json();
  const data = await createAdminCategory(body);
  return c.json({ success: true, data });
});

adminRoutes.patch('/category/:id', async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const data = await updateAdminCategory(id, body);
  return c.json({ success: true, data });
});

adminRoutes.delete('/category/:id', async (c) => {
  const { id } = c.req.param();
  await deleteAdminCategory(id);
  return c.json({ success: true, message: 'Category deleted' });
});

/* Collections */
adminRoutes.get('/collections', async (c) => {
  const data = await listAdminCollections();
  return c.json({ success: true, data });
});

adminRoutes.get('/collections/:id', async (c) => {
  const { id } = c.req.param();
  const data = await getAdminCollection(id);
  return c.json({ success: true, data });
});

adminRoutes.post('/collection', async (c) => {
  const { body, gameIds } = await c.req.json();
  const data = await createAdminCollection(body, gameIds ?? []);
  return c.json({ success: true, data });
});

adminRoutes.patch('/collection/:id', async (c) => {
  const { id } = c.req.param();
  const { body, gameIds } = await c.req.json();
  const data = await updateAdminCollection(id, body, gameIds);
  return c.json({ success: true, data });
});

adminRoutes.delete('/collection/:id', async (c) => {
  const { id } = c.req.param();
  await deleteAdminCollection(id);
  return c.json({ success: true, message: 'Collection deleted' });
});

/* Guides (articles) */
adminRoutes.get('/guides', async (c) => {
  const result = await listAdminGuides(c.req.query());
  return c.json({ success: true, data: result });
});

adminRoutes.get('/guides/:id', async (c) => {
  const { id } = c.req.param();
  const data = await getAdminGuide(id);
  return c.json({ success: true, data });
});

adminRoutes.post('/guide', async (c) => {
  const body = await c.req.json();
  const data = await createAdminGuide(body);
  return c.json({ success: true, data });
});

adminRoutes.patch('/guide/:id', async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const data = await updateAdminGuide(id, body);
  return c.json({ success: true, data });
});

adminRoutes.delete('/guide/:id', async (c) => {
  const { id } = c.req.param();
  await deleteAdminArticle('guides', id);
  return c.json({ success: true, message: 'Guide deleted' });
});

/* Fixes */
adminRoutes.get('/fixes', async (c) => {
  const result = await listAdminFixes(c.req.query());
  return c.json({ success: true, data: result });
});

adminRoutes.get('/fixes/:id', async (c) => {
  const { id } = c.req.param();
  const data = await getAdminFix(id);
  return c.json({ success: true, data });
});

adminRoutes.post('/fix', async (c) => {
  const body = await c.req.json();
  const data = await createAdminFix(body);
  return c.json({ success: true, data });
});

adminRoutes.patch('/fix/:id', async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const data = await updateAdminFix(id, body);
  return c.json({ success: true, data });
});

adminRoutes.delete('/fix/:id', async (c) => {
  const { id } = c.req.param();
  await deleteAdminArticle('fix_articles', id);
  return c.json({ success: true, message: 'Fix deleted' });
});

/* Users */
adminRoutes.get('/users', async (c) => {
  const result = await listAdminUsers(c.req.query());
  return c.json({ success: true, data: result });
});

adminRoutes.get('/users/:id', async (c) => {
  const { id } = c.req.param();
  const data = await getAdminUser(id);
  return c.json({ success: true, data });
});

adminRoutes.patch('/user/:id', async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const data = await updateAdminUser(id, body);
  return c.json({ success: true, data });
});

adminRoutes.delete('/user/:id', async (c) => {
  const { id } = c.req.param();
  await deleteAdminUser(id);
  return c.json({ success: true, message: 'User deleted' });
});

/* Reports */
adminRoutes.get('/reports', async (c) => {
  const result = await listAdminReports(c.req.query());
  return c.json({ success: true, data: result });
});

adminRoutes.get('/reports/:id', async (c) => {
  const { id } = c.req.param();
  const data = await getAdminReport(id);
  return c.json({ success: true, data });
});

adminRoutes.patch('/report/:id', async (c) => {
  const { id } = c.req.param();
  const { status } = await c.req.json();
  const data = await updateAdminReportStatus(id, status);
  return c.json({ success: true, data });
});

adminRoutes.delete('/report/:id', async (c) => {
  const { id } = c.req.param();
  await deleteAdminReport(id);
  return c.json({ success: true, message: 'Report deleted' });
});

/* Unban Requests */
adminRoutes.get('/unban-requests', async (c) => {
  const result = await listAdminUnbanRequests(c.req.query());
  return c.json({ success: true, data: result });
});

adminRoutes.get('/unban-requests/:id', async (c) => {
  const { id } = c.req.param();
  const data = await getAdminUnbanRequest(id);
  return c.json({ success: true, data });
});

adminRoutes.patch('/unban-request/:id', async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const data = await reviewAdminUnbanRequest(id, body);
  return c.json({ success: true, data });
});

adminRoutes.delete('/unban-request/:id', async (c) => {
  const { id } = c.req.param();
  await deleteAdminUnbanRequest(id);
  return c.json({ success: true, message: 'Unban request deleted' });
});

/* Suggestions */
adminRoutes.get('/suggestions', async (c) => {
  const result = await listAdminSuggestions(c.req.query());
  return c.json({ success: true, data: result });
});

adminRoutes.get('/suggestions/:id', async (c) => {
  const { id } = c.req.param();
  const data = await getAdminSuggestion(id);
  return c.json({ success: true, data });
});

adminRoutes.patch('/suggestion/:id', async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  // Expect body to contain { status, note }
  const data = await reviewAdminSuggestion(id, body.status, body.note);
  return c.json({ success: true, data });
});

adminRoutes.delete('/suggestion/:id', async (c) => {
  const { id } = c.req.param();
  await deleteAdminSuggestion(id);
  return c.json({ success: true, message: 'Suggestion deleted' });
});

/* Steam Free */
adminRoutes.get('/steam-free', async (c) => {
  const data = await getAdminSteamFreeContent();
  return c.json({ success: true, data });
});

adminRoutes.patch('/steam-free/video', async (c) => {
  const { video_url } = await c.req.json();
  const data = await updateSteamFreeVideoUrl(video_url);
  return c.json({ success: true, data });
});

adminRoutes.post('/steam-free/step', async (c) => {
  const body = await c.req.json();
  const data = await createSteamFreeStep(body);
  return c.json({ success: true, data });
});

adminRoutes.patch('/steam-free/step/:id', async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const data = await updateSteamFreeStep(id, body);
  return c.json({ success: true, data });
});

adminRoutes.delete('/steam-free/step/:id', async (c) => {
  const { id } = c.req.param();
  await deleteSteamFreeStep(id);
  return c.json({ success: true, message: 'Step deleted' });
});

export default adminRoutes;
