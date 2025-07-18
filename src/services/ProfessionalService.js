import StorageService from './StorageService';

class ProfessionalService {
  static async getProfessionals() {
    try {
      const users = await StorageService.getItem('users') || [];
      // Filtra apenas usuários que são profissionais
      const professionals = users.filter(user => user.userType === 'professional');
      
      // Adiciona a pontuação média e número de avaliações
      const professionalsWithRatings = await Promise.all(professionals.map(async (prof) => {
        const ratings = await this.getProfessionalRatings(prof.id);
        const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = ratings.length > 0 ? (totalRating / ratings.length) : 0;
        return { ...prof, averageRating, totalReviews: ratings.length };
      }));

      return professionalsWithRatings;
    } catch (error) {
      console.error('Erro ao buscar profissionais:', error);
      return [];
    }
  }

  static async getProfessionalById(id) {
    try {
      const professionals = await this.getProfessionals();
      return professionals.find(prof => prof.id === id);
    } catch (error) {
      console.error('Erro ao buscar profissional por ID:', error);
      return null;
    }
  }

  static async addProfessional(professionalData) {
    try {
      const users = await StorageService.getItem('users') || [];
      users.push(professionalData);
      await StorageService.setItem('users', users);
      return { success: true };
    } catch (error) {
      console.error('Erro ao adicionar profissional:', error);
      return { success: false, error: 'Erro ao adicionar profissional' };
    }
  }

  static async updateProfessional(updatedProfessionalData) {
    try {
      let users = await StorageService.getItem('users') || [];
      const index = users.findIndex(user => user.id === updatedProfessionalData.id);
      if (index !== -1) {
        users[index] = { ...users[index], ...updatedProfessionalData };
        await StorageService.setItem('users', users);
        return { success: true };
      } else {
        return { success: false, error: 'Profissional não encontrado' };
      }
    } catch (error) {
      console.error('Erro ao atualizar profissional:', error);
      return { success: false, error: 'Erro ao atualizar profissional' };
    }
  }

  static async getProfessionalRatings(professionalId) {
    try {
      const allRatings = await StorageService.getItem('professionalRatings') || {};
      return allRatings[professionalId] || [];
    } catch (error) {
      console.error('Erro ao buscar avaliações do profissional:', error);
      return [];
    }
  }

  static async addProfessionalRating(professionalId, ratingData) {
    try {
      const allRatings = await StorageService.getItem('professionalRatings') || {};
      if (!allRatings[professionalId]) {
        allRatings[professionalId] = [];
      }
      allRatings[professionalId].push(ratingData);
      await StorageService.setItem('professionalRatings', allRatings);
      return { success: true };
    } catch (error) {
      console.error('Erro ao adicionar avaliação:', error);
      return { success: false, error: 'Erro ao adicionar avaliação' };
    }
  }

  static async getServicesRequested() {
    try {
      return await StorageService.getItem('servicesRequested') || [];
    } catch (error) {
      console.error('Erro ao buscar serviços solicitados:', error);
      return [];
    }
  }

  static async addServiceRequest(serviceRequestData) {
    try {
      const servicesRequested = await this.getServicesRequested();
      servicesRequested.push(serviceRequestData);
      await StorageService.setItem('servicesRequested', servicesRequested);
      return { success: true };
    } catch (error) {
      console.error('Erro ao adicionar solicitação de serviço:', error);
      return { success: false, error: 'Erro ao adicionar solicitação de serviço' };
    }
  }

  static async updateServiceRequest(updatedServiceRequestData) {
    try {
      let servicesRequested = await this.getServicesRequested();
      const index = servicesRequested.findIndex(req => req.id === updatedServiceRequestData.id);
      if (index !== -1) {
        servicesRequested[index] = { ...servicesRequested[index], ...updatedServiceRequestData };
        await StorageService.setItem('servicesRequested', servicesRequested);
        return { success: true };
      } else {
        return { success: false, error: 'Solicitação de serviço não encontrada' };
      }
    } catch (error) {
      console.error('Erro ao atualizar solicitação de serviço:', error);
      return { success: false, error: 'Erro ao atualizar solicitação de serviço' };
    }
  }
}

export default ProfessionalService;

