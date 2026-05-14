/**
 * Доступ только к своим записям: список/один элемент фильтруются по user из JWT;
 * при создании user подставляется с сервера; удаление — только своя запись.
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::saved-route.saved-route', ({ strapi }) => ({
  async find(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized();
    }
    ctx.query.filters = {
      user: { id: { $eq: user.id } },
    };
    return super.find(ctx);
  },

  async findOne(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized();
    }
    ctx.query.filters = {
      user: { id: { $eq: user.id } },
    };
    return super.findOne(ctx);
  },

  async create(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized();
    }
    const routeRef = ctx.request.body?.data?.route;
    if (routeRef === undefined || routeRef === null || routeRef === '') {
      return ctx.badRequest('Передайте маршрут (route).');
    }

    const saves = await strapi.db.query('api::saved-route.saved-route').findMany({
      where: { user: { id: user.id } },
      populate: { route: true },
    });

    const duplicate = saves.find((entry) => {
      const r = entry.route as { documentId?: string; id?: number } | undefined;
      if (!r) return false;
      return r.documentId === routeRef || String(r.id) === String(routeRef);
    });

    if (duplicate) {
      const sanitized = await this.sanitizeOutput(duplicate, ctx);
      return this.transformResponse(sanitized);
    }

    ctx.request.body.data.user = user.id;
    return super.create(ctx);
  },

  async delete(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized();
    }

    const paramId = ctx.params.id;

    let entry = await strapi.db.query('api::saved-route.saved-route').findOne({
      where: {
        documentId: paramId,
        user: { id: user.id },
      },
    });

    if (!entry && /^\d+$/.test(String(paramId))) {
      entry = await strapi.db.query('api::saved-route.saved-route').findOne({
        where: {
          id: Number(paramId),
          user: { id: user.id },
        },
      });
    }

    if (!entry) {
      return ctx.notFound();
    }

    await strapi.db.query('api::saved-route.saved-route').delete({
      where: { id: entry.id },
    });

    const sanitized = await this.sanitizeOutput(entry, ctx);
    return this.transformResponse(sanitized);
  },
}));
