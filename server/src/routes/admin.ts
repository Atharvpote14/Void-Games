import { Hono } from 'hono';
import { getDashboard } from '../../controllers/adminController.js';
import { getAnalyticsData } from '../../controllers/adminAnalyticsController.js';
import { getGames, getGame, createGame, updateGame, deleteGame } from '../../controllers/adminGamesController.js';
import { getCategories, getCategory, createCategory, updateCategory, deleteCategory } from '../../controllers/adminCategoriesController.js';
import { getCollections, getCollection, createCollection, updateCollection, deleteCollection, getGamePicker } from '../../controllers/adminCollectionsController.js';
import { getGuides, getGuide, createGuide, updateGuide, deleteGuide } from '../../controllers/adminArticlesController.js';
import { getFixes, getFix, createFix, updateFix, deleteFix } from '../../controllers/adminArticlesController.js';
import { getUsers, getUser, updateUser, deleteUser } from '../../controllers/adminUsersController.js';
import { getReports, getReport, updateReportStatus, deleteReport } from '../../controllers/adminReportsController.js';
import { getUnbanRequests, getUnbanRequest, reviewUnbanRequest, deleteUnbanRequest } from '../../controllers/adminUnbanRequestsController.js';
import { getSuggestions, getSuggestion, updateSuggestion, deleteSuggestion } from '../../controllers/adminSuggestionsController.js';
import { getSteamFreeContent, updateSteamFreeVideo, createStep, updateStep, deleteStep } from '../../controllers/adminSteamFreeController.js';

export const adminRoutes = new Hono();

// Dashboard & analytics
adminRoutes.get('/dashboard', async (c) => {
  const result = await getDashboard(c);
  return c.json(result);
});
adminRoutes.get('/analytics', async (c) => {
  const result = await getAnalyticsData(c);
  return c.json(result);
});

// Games
adminRoutes.get('/games/picker', async (c) => {
  const result = await getGamePicker(c);
  return c.json(result);
});
adminRoutes.get('/games', async (c) => {
  const result = await getGames(c);
  return c.json(result);
});
adminRoutes.get('/games/:id', async (c) => {
  const result = await getGame(c);
  return c.json(result);
});
adminRoutes.post('/games', async (c) => {
  const result = await createGame(c);
  return c.json(result);
});
adminRoutes.patch('/games/:id', async (c) => {
  const result = await updateGame(c);
  return c.json(result);
});
adminRoutes.delete('/games/:id', async (c) => {
  const result = await deleteGame(c);
  return c.json(result);
});

// Categories
adminRoutes.get('/categories', async (c) => {
  const result = await getCategories(c);
  return c.json(result);
});
adminRoutes.get('/categories/:id', async (c) => {
  const result = await getCategory(c);
  return c.json(result);
});
adminRoutes.post('/category', async (c) => {
  const result = await createCategory(c);
  return c.json(result);
});
adminRoutes.patch('/category/:id', async (c) => {
  const result = await updateCategory(c);
  return c.json(result);
});
adminRoutes.delete('/category/:id', async (c) => {
  const result = await deleteCategory(c);
  return c.json(result);
});

// Collections
adminRoutes.get('/collections', async (c) => {
  const result = await getCollections(c);
  return c.json(result);
});
adminRoutes.get('/collections/:id', async (c) => {
  const result = await getCollection(c);
  return c.json(result);
});
adminRoutes.post('/collection', async (c) => {
  const result = await createCollection(c);
  return c.json(result);
});
adminRoutes.patch('/collection/:id', async (c) => {
  const result = await updateCollection(c);
  return c.json(result);
});
adminRoutes.delete('/collection/:id', async (c) => {
  const result = await deleteCollection(c);
  return c.json(result);
});

// Guides (articles)
adminRoutes.get('/guides', async (c) => {
  const result = await getGuides(c);
  return c.json(result);
});
adminRoutes.get('/guides/:id', async (c) => {
  const result = await getGuide(c);
  return c.json(result);
});
adminRoutes.post('/guide', async (c) => {
  const result = await createGuide(c);
  return c.json(result);
});
adminRoutes.patch('/guide/:id', async (c) => {
  const result = await updateGuide(c);
  return c.json(result);
});
adminRoutes.delete('/guide/:id', async (c) => {
  const result = await deleteGuide(c);
  return c.json(result);
});

// Fixes
adminRoutes.get('/fixes', async (c) => {
  const result = await getFixes(c);
  return c.json(result);
});
adminRoutes.get('/fixes/:id', async (c) => {
  const result = await getFix(c);
  return c.json(result);
});
adminRoutes.post('/fix', async (c) => {
  const result = await createFix(c);
  return c.json(result);
});
adminRoutes.patch('/fix/:id', async (c) => {
  const result = await updateFix(c);
  return c.json(result);
});
adminRoutes.delete('/fix/:id', async (c) => {
  const result = await deleteFix(c);
  return c.json(result);
});

// Users
adminRoutes.get('/users', async (c) => {
  const result = await getUsers(c);
  return c.json(result);
});
adminRoutes.get('/users/:id', async (c) => {
  const result = await getUser(c);
  return c.json(result);
});
adminRoutes.patch('/user/:id', async (c) => {
  const result = await updateUser(c);
  return c.json(result);
});
adminRoutes.delete('/user/:id', async (c) => {
  const result = await deleteUser(c);
  return c.json(result);
});

// Reports
adminRoutes.get('/reports', async (c) => {
  const result = await getReports(c);
  return c.json(result);
});
adminRoutes.get('/reports/:id', async (c) => {
  const result = await getReport(c);
  return c.json(result);
});
adminRoutes.patch('/report/:id', async (c) => {
  const result = await updateReportStatus(c);
  return c.json(result);
});
adminRoutes.delete('/report/:id', async (c) => {
  const result = await deleteReport(c);
  return c.json(result);
});

// Unban Requests
adminRoutes.get('/unban-requests', async (c) => {
  const result = await getUnbanRequests(c);
  return c.json(result);
});
adminRoutes.get('/unban-requests/:id', async (c) => {
  const result = await getUnbanRequest(c);
  return c.json(result);
});
adminRoutes.patch('/unban-request/:id', async (c) => {
  const result = await reviewUnbanRequest(c);
  return c.json(result);
});
adminRoutes.delete('/unban-request/:id', async (c) => {
  const result = await deleteUnbanRequest(c);
  return c.json(result);
});

// Suggestions
adminRoutes.get('/suggestions', async (c) => {
  const result = await getSuggestions(c);
  return c.json(result);
});
adminRoutes.get('/suggestions/:id', async (c) => {
  const result = await getSuggestion(c);
  return c.json(result);
});
adminRoutes.patch('/suggestion/:id', async (c) => {
  const result = await updateSuggestion(c);
  return c.json(result);
});
adminRoutes.delete('/suggestion/:id', async (c) => {
  const result = await deleteSuggestion(c);
  return c.json(result);
});

// Steam Free
adminRoutes.get('/steam-free', async (c) => {
  const result = await getSteamFreeContent(c);
  return c.json(result);
});
adminRoutes.patch('/steam-free/video', async (c) => {
  const result = await updateSteamFreeVideo(c);
  return c.json(result);
});
adminRoutes.post('/steam-free/step', async (c) => {
  const result = await createStep(c);
  return c.json(result);
});
adminRoutes.patch('/steam-free/step/:id', async (c) => {
  const result = await updateStep(c);
  return c.json(result);
});
adminRoutes.delete('/steam-free/step/:id', async (c) => {
  const result = await deleteStep(c);
  return c.json(result);
});

export default adminRoutes;
