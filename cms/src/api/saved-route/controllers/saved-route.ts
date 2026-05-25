import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::saved-route.saved-route', ({ strapi }) => ({
  async find(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized();
    }

    const entries = await strapi.db.query('api::saved-route.saved-route').findMany({
      where: { user: { id: user.id } },
      populate: {
        route: {
          populate: {
            cover: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const sanitized = await this.sanitizeOutput(entries, ctx);
    return this.transformResponse(sanitized);
  },

  async findOne(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized();
    }

    const paramId = ctx.params.id;
    const entry = await strapi.db.query('api::saved-route.saved-route').findOne({
      where: /^\d+$/.test(String(paramId))
        ? { id: Number(paramId), user: { id: user.id } }
        : { documentId: paramId, user: { id: user.id } },
      populate: {
        route: {
          populate: {
            cover: true,
          },
        },
      },
    });

    if (!entry) {
      return ctx.notFound();
    }

    const sanitized = await this.sanitizeOutput(entry, ctx);
    return this.transformResponse(sanitized);
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

    const route = await strapi.db.query('api::route.route').findOne({
      where: /^\d+$/.test(String(routeRef)) ? { id: Number(routeRef) } : { documentId: routeRef },
    });

    if (!route) {
      return ctx.badRequest('Маршрут не найден.');
    }

    const saves = await strapi.db.query('api::saved-route.saved-route').findMany({
      where: { user: { id: user.id } },
      populate: { route: true },
    });

    const duplicate = saves.find((entry) => {
      const r = entry.route as { documentId?: string; id?: number } | undefined;
      if (!r) return false;
      return r.documentId === route.documentId || String(r.id) === String(route.id);
    });

    if (duplicate) {
      const sanitized = await this.sanitizeOutput(duplicate, ctx);
      return this.transformResponse(sanitized);
    }

    const entry = await strapi.db.query('api::saved-route.saved-route').create({
      data: {
        user: user.id,
        route: route.id,
      },
      populate: {
        route: {
          populate: {
            cover: true,
          },
        },
      },
    });

    const sanitized = await this.sanitizeOutput(entry, ctx);
    return this.transformResponse(sanitized);
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
