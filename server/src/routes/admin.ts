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
import {
  validateGameInput,
  validateScreenshotInput,
  validateDownloadLinkInput,
  validateTagInput,
  validateCollectionGameIds,
  validateCategoryInput,
  validateCollectionInput,
  validateGuideInput,
  validateFixInput,
} from '../../validations/adminValidation.js';

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

const handleGetGame = async (c: any) => {
  const { id } = c.req.param();
  const result = await getAdminGame(id);
  return c.json({ success: true, data: result });
};
adminRoutes.get('/games/:id', handleGetGame);
adminRoutes.get('/game/:id', handleGetGame);

const handleCreateGame = async (c: any) => {
  const body = await c.req.json();
  const game: any = validateGameInput(body);
  game.screenshots = validateScreenshotInput(body);
  game.download_links = (body.download_links || []).map(validateDownloadLinkInput);
  game.tags = validateTagInput(body);
  game.collection_ids = validateCollectionGameIds(body.collection_ids);
  const result = await createAdminGame(game);
  return c.json({ success: true, data: result }, 201);
};
adminRoutes.post('/games', handleCreateGame);
adminRoutes.post('/game', handleCreateGame);

const handleUpdateGame = async (c: any) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const game: any = validateGameInput(body);
  if (body.screenshots !== undefined) game.screenshots = validateScreenshotInput(body);
  if (body.download_links !== undefined) game.download_links = body.download_links.map(validateDownloadLinkInput);
  if (body.tags !== undefined) game.tags = validateTagInput(body);
  if (body.collection_ids !== undefined) game.collection_ids = validateCollectionGameIds(body.collection_ids);
  const result = await updateAdminGame(id, game);
  return c.json({ success: true, data: result });
};
adminRoutes.patch('/games/:id', handleUpdateGame);
adminRoutes.put('/games/:id', handleUpdateGame);
adminRoutes.patch('/game/:id', handleUpdateGame);
adminRoutes.put('/game/:id', handleUpdateGame);

const handleDeleteGame = async (c: any) => {
  const { id } = c.req.param();
  await deleteAdminGame(id);
  return c.json({ success: true, message: 'Game deleted' });
};
adminRoutes.delete('/games/:id', handleDeleteGame);
adminRoutes.delete('/game/:id', handleDeleteGame);

/* Categories */
const handleListCategories = async (c: any) => {
  const data = await listAdminCategories();
  return c.json({ success: true, data: { categories: data } });
};
adminRoutes.get('/categories', handleListCategories);
adminRoutes.get('/category', handleListCategories);

const handleGetCategory = async (c: any) => {
  const { id } = c.req.param();
  const data = await getAdminCategory(id);
  return c.json({ success: true, data });
};
adminRoutes.get('/categories/:id', handleGetCategory);
adminRoutes.get('/category/:id', handleGetCategory);

const handleCreateCategory = async (c: any) => {
  const body = await c.req.json();
  const clean = validateCategoryInput(body);
  const data = await createAdminCategory(clean);
  return c.json({ success: true, data }, 201);
};
adminRoutes.post('/category', handleCreateCategory);
adminRoutes.post('/categories', handleCreateCategory);

const handleUpdateCategory = async (c: any) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const clean = validateCategoryInput(body);
  const data = await updateAdminCategory(id, clean);
  return c.json({ success: true, data });
};
adminRoutes.patch('/category/:id', handleUpdateCategory);
adminRoutes.put('/category/:id', handleUpdateCategory);
adminRoutes.patch('/categories/:id', handleUpdateCategory);
adminRoutes.put('/categories/:id', handleUpdateCategory);

const handleDeleteCategory = async (c: any) => {
  const { id } = c.req.param();
  await deleteAdminCategory(id);
  return c.json({ success: true, message: 'Category deleted' });
};
adminRoutes.delete('/category/:id', handleDeleteCategory);
adminRoutes.delete('/categories/:id', handleDeleteCategory);

/* Collections */
const handleListCollections = async (c: any) => {
  const data = await listAdminCollections();
  return c.json({ success: true, data: { collections: data } });
};
adminRoutes.get('/collections', handleListCollections);
adminRoutes.get('/collection', handleListCollections);

const handleGetCollection = async (c: any) => {
  const { id } = c.req.param();
  const data = await getAdminCollection(id);
  return c.json({ success: true, data });
};
adminRoutes.get('/collections/:id', handleGetCollection);
adminRoutes.get('/collection/:id', handleGetCollection);

const handleCreateCollection = async (c: any) => {
  const payload = await c.req.json();
  const clean = validateCollectionInput(payload.body || payload);
  const rawGameIds = payload.game_ids ?? payload.gameIds ?? payload.body?.game_ids ?? payload.body?.gameIds ?? [];
  const gameIds = validateCollectionGameIds(rawGameIds);
  const data = await createAdminCollection(clean, gameIds);
  return c.json({ success: true, data }, 201);
};
adminRoutes.post('/collection', handleCreateCollection);
adminRoutes.post('/collections', handleCreateCollection);

const handleUpdateCollection = async (c: any) => {
  const { id } = c.req.param();
  const payload = await c.req.json();
  const clean = validateCollectionInput(payload.body || payload);
  const rawGameIds = payload.game_ids !== undefined
    ? payload.game_ids
    : (payload.gameIds !== undefined
      ? payload.gameIds
      : (payload.body?.game_ids !== undefined
        ? payload.body.game_ids
        : payload.body?.gameIds));
  const gameIds = rawGameIds !== undefined ? validateCollectionGameIds(rawGameIds) : undefined;
  const data = await updateAdminCollection(id, clean, gameIds);
  return c.json({ success: true, data });
};
adminRoutes.patch('/collection/:id', handleUpdateCollection);
adminRoutes.put('/collection/:id', handleUpdateCollection);
adminRoutes.patch('/collections/:id', handleUpdateCollection);
adminRoutes.put('/collections/:id', handleUpdateCollection);

const handleDeleteCollection = async (c: any) => {
  const { id } = c.req.param();
  await deleteAdminCollection(id);
  return c.json({ success: true, message: 'Collection deleted' });
};
adminRoutes.delete('/collection/:id', handleDeleteCollection);
adminRoutes.delete('/collections/:id', handleDeleteCollection);

/* Guides (articles) */
adminRoutes.get('/guides', async (c) => {
  const result = await listAdminGuides(c.req.query());
  return c.json({ success: true, data: result });
});

const handleGetGuide = async (c: any) => {
  const { id } = c.req.param();
  const data = await getAdminGuide(id);
  return c.json({ success: true, data });
};
adminRoutes.get('/guides/:id', handleGetGuide);
adminRoutes.get('/guide/:id', handleGetGuide);

const handleCreateGuide = async (c: any) => {
  const body = await c.req.json();
  const clean = validateGuideInput(body);
  const data = await createAdminGuide(clean);
  return c.json({ success: true, data }, 201);
};
adminRoutes.post('/guide', handleCreateGuide);
adminRoutes.post('/guides', handleCreateGuide);

const handleUpdateGuide = async (c: any) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const clean = validateGuideInput(body);
  const data = await updateAdminGuide(id, clean);
  return c.json({ success: true, data });
};
adminRoutes.patch('/guide/:id', handleUpdateGuide);
adminRoutes.put('/guide/:id', handleUpdateGuide);
adminRoutes.patch('/guides/:id', handleUpdateGuide);
adminRoutes.put('/guides/:id', handleUpdateGuide);

const handleDeleteGuide = async (c: any) => {
  const { id } = c.req.param();
  await deleteAdminArticle('guides', id);
  return c.json({ success: true, message: 'Guide deleted' });
};
adminRoutes.delete('/guide/:id', handleDeleteGuide);
adminRoutes.delete('/guides/:id', handleDeleteGuide);

/* Fixes */
adminRoutes.get('/fixes', async (c) => {
  const result = await listAdminFixes(c.req.query());
  return c.json({ success: true, data: result });
});

const handleGetFix = async (c: any) => {
  const { id } = c.req.param();
  const data = await getAdminFix(id);
  return c.json({ success: true, data });
};
adminRoutes.get('/fixes/:id', handleGetFix);
adminRoutes.get('/fix/:id', handleGetFix);

const handleCreateFix = async (c: any) => {
  const body = await c.req.json();
  const clean = validateFixInput(body);
  const data = await createAdminFix(clean);
  return c.json({ success: true, data }, 201);
};
adminRoutes.post('/fix', handleCreateFix);
adminRoutes.post('/fixes', handleCreateFix);

const handleUpdateFix = async (c: any) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const clean = validateFixInput(body);
  const data = await updateAdminFix(id, clean);
  return c.json({ success: true, data });
};
adminRoutes.patch('/fix/:id', handleUpdateFix);
adminRoutes.put('/fix/:id', handleUpdateFix);
adminRoutes.patch('/fixes/:id', handleUpdateFix);
adminRoutes.put('/fixes/:id', handleUpdateFix);

const handleDeleteFix = async (c: any) => {
  const { id } = c.req.param();
  await deleteAdminArticle('fix_articles', id);
  return c.json({ success: true, message: 'Fix deleted' });
};
adminRoutes.delete('/fix/:id', handleDeleteFix);
adminRoutes.delete('/fixes/:id', handleDeleteFix);

/* Users */
adminRoutes.get('/users', async (c) => {
  const result = await listAdminUsers(c.req.query());
  return c.json({ success: true, data: result });
});

const handleGetUser = async (c: any) => {
  const { id } = c.req.param();
  const data = await getAdminUser(id);
  return c.json({ success: true, data });
};
adminRoutes.get('/users/:id', handleGetUser);
adminRoutes.get('/user/:id', handleGetUser);

const handleUpdateUser = async (c: any) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const clean: any = {};
  if (body.role !== undefined) clean.role = body.role;
  if (body.is_banned !== undefined) clean.is_banned = body.is_banned;
  const data = await updateAdminUser(id, clean);
  return c.json({ success: true, data });
};
adminRoutes.patch('/user/:id', handleUpdateUser);
adminRoutes.put('/user/:id', handleUpdateUser);
adminRoutes.patch('/users/:id', handleUpdateUser);
adminRoutes.put('/users/:id', handleUpdateUser);

const handleDeleteUser = async (c: any) => {
  const { id } = c.req.param();
  await deleteAdminUser(id);
  return c.json({ success: true, message: 'User deleted' });
};
adminRoutes.delete('/user/:id', handleDeleteUser);
adminRoutes.delete('/users/:id', handleDeleteUser);

/* Reports */
adminRoutes.get('/reports', async (c) => {
  const result = await listAdminReports(c.req.query());
  return c.json({ success: true, data: result });
});

const handleGetReport = async (c: any) => {
  const { id } = c.req.param();
  const data = await getAdminReport(id);
  return c.json({ success: true, data });
};
adminRoutes.get('/reports/:id', handleGetReport);
adminRoutes.get('/report/:id', handleGetReport);

const handleUpdateReport = async (c: any) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const data = await updateAdminReportStatus(id, body.status);
  return c.json({ success: true, data });
};
adminRoutes.patch('/report/:id', handleUpdateReport);
adminRoutes.put('/report/:id', handleUpdateReport);
adminRoutes.patch('/reports/:id', handleUpdateReport);
adminRoutes.put('/reports/:id', handleUpdateReport);

const handleDeleteReport = async (c: any) => {
  const { id } = c.req.param();
  await deleteAdminReport(id);
  return c.json({ success: true, message: 'Report deleted' });
};
adminRoutes.delete('/report/:id', handleDeleteReport);
adminRoutes.delete('/reports/:id', handleDeleteReport);

/* Unban Requests */
adminRoutes.get('/unban-requests', async (c) => {
  const result = await listAdminUnbanRequests(c.req.query());
  return c.json({ success: true, data: result });
});

const handleGetUnbanRequest = async (c: any) => {
  const { id } = c.req.param();
  const data = await getAdminUnbanRequest(id);
  return c.json({ success: true, data });
};
adminRoutes.get('/unban-requests/:id', handleGetUnbanRequest);
adminRoutes.get('/unban-request/:id', handleGetUnbanRequest);

const handleReviewUnbanRequest = async (c: any) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const adminNote = body.admin_note ?? body.adminNote ?? body.note;
  const data = await reviewAdminUnbanRequest(id, { status: body.status, adminNote });
  return c.json({ success: true, data });
};
adminRoutes.patch('/unban-request/:id', handleReviewUnbanRequest);
adminRoutes.put('/unban-request/:id', handleReviewUnbanRequest);
adminRoutes.patch('/unban-requests/:id', handleReviewUnbanRequest);
adminRoutes.put('/unban-requests/:id', handleReviewUnbanRequest);

const handleDeleteUnbanRequest = async (c: any) => {
  const { id } = c.req.param();
  await deleteAdminUnbanRequest(id);
  return c.json({ success: true, message: 'Unban request deleted' });
};
adminRoutes.delete('/unban-request/:id', handleDeleteUnbanRequest);
adminRoutes.delete('/unban-requests/:id', handleDeleteUnbanRequest);

/* Suggestions */
adminRoutes.get('/suggestions', async (c) => {
  const result = await listAdminSuggestions(c.req.query());
  return c.json({ success: true, data: result });
});

const handleGetSuggestion = async (c: any) => {
  const { id } = c.req.param();
  const data = await getAdminSuggestion(id);
  return c.json({ success: true, data });
};
adminRoutes.get('/suggestions/:id', handleGetSuggestion);
adminRoutes.get('/suggestion/:id', handleGetSuggestion);

const handleReviewSuggestion = async (c: any) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const note = body.admin_note ?? body.note ?? body.adminNote;
  const data = await reviewAdminSuggestion(id, body.status, note);
  return c.json({ success: true, data });
};
adminRoutes.patch('/suggestion/:id', handleReviewSuggestion);
adminRoutes.put('/suggestion/:id', handleReviewSuggestion);
adminRoutes.patch('/suggestions/:id', handleReviewSuggestion);
adminRoutes.put('/suggestions/:id', handleReviewSuggestion);

const handleDeleteSuggestion = async (c: any) => {
  const { id } = c.req.param();
  await deleteAdminSuggestion(id);
  return c.json({ success: true, message: 'Suggestion deleted' });
};
adminRoutes.delete('/suggestion/:id', handleDeleteSuggestion);
adminRoutes.delete('/suggestions/:id', handleDeleteSuggestion);

/* Steam Free */
adminRoutes.get('/steam-free', async (c) => {
  const data = await getAdminSteamFreeContent();
  return c.json({ success: true, data });
});

const handleUpdateSteamFreeVideo = async (c: any) => {
  const { video_url } = await c.req.json();
  const data = await updateSteamFreeVideoUrl(video_url);
  return c.json({ success: true, data });
};
adminRoutes.patch('/steam-free/video', handleUpdateSteamFreeVideo);
adminRoutes.put('/steam-free/video', handleUpdateSteamFreeVideo);

const handleCreateSteamFreeStep = async (c: any) => {
  const body = await c.req.json();
  const data = await createSteamFreeStep(body);
  return c.json({ success: true, data }, 201);
};
adminRoutes.post('/steam-free/step', handleCreateSteamFreeStep);
adminRoutes.post('/steam-free/steps', handleCreateSteamFreeStep);

const handleUpdateSteamFreeStep = async (c: any) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const data = await updateSteamFreeStep(id, body);
  return c.json({ success: true, data });
};
adminRoutes.patch('/steam-free/step/:id', handleUpdateSteamFreeStep);
adminRoutes.put('/steam-free/step/:id', handleUpdateSteamFreeStep);
adminRoutes.patch('/steam-free/steps/:id', handleUpdateSteamFreeStep);
adminRoutes.put('/steam-free/steps/:id', handleUpdateSteamFreeStep);

const handleDeleteSteamFreeStep = async (c: any) => {
  const { id } = c.req.param();
  await deleteSteamFreeStep(id);
  return c.json({ success: true, message: 'Step deleted' });
};
adminRoutes.delete('/steam-free/step/:id', handleDeleteSteamFreeStep);
adminRoutes.delete('/steam-free/steps/:id', handleDeleteSteamFreeStep);

export default adminRoutes;
