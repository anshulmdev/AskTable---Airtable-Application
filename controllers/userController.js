// controllers/userController.js
import { globalConfig } from '@airtable/blocks';
import { env } from '../env';

export async function fetchOrCreateUser(base, setDialogMessage) {
  try {
    const collaborators = base.activeCollaborators;
    if (collaborators.length > 0) {
      const collaborator = collaborators[0];
      const userId = collaborator.id;
      const userEmail = collaborator.email;

      const response = await fetch(
        `https://app.nocodb.com/api/v2/tables/m845htjqz88twli/records?where=where%3D%28User%2Ceq%2C${userId}%29&limit=1`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'xc-token': env.DATABASE_TOKEN,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.list.length > 0) {
          const userData = data.list[0];
          await globalConfig.setAsync('airtableuserid', {
            id: userData.Id,
            email: userData.Email,
            name: userData.Name,
            credits: userData.Credits,
          });
          return userData;
        } else {
          const createResponse = await fetch(
            'https://app.nocodb.com/api/v2/tables/m845htjqz88twli/records',
            {
              method: 'POST',
              headers: {
                accept: 'application/json',
                'xc-token': env.DATABASE_TOKEN,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                User: userId,
                Credits: env.INITIAL_CREDITS,
                Email: userEmail,
                Name: collaborator.name,
              }),
            }
          );

          if (createResponse.ok) {
            const createdUser = await createResponse.json();
            await globalConfig.setAsync('airtableuserid', {
              id: createdUser.Id,
              email: userEmail,
              name: collaborator.name,
              credits: env.INITIAL_CREDITS,
            });
            return createdUser;
          } else {
            throw new Error('Error creating user');
          }
        }
      } else {
        throw new Error('Error fetching user data');
      }
    }
  } catch (error) {
    console.error('Error fetching/creating user:', error);
    setDialogMessage({ message: 'Error fetching/creating user. Please reload the app.', type: 'error' });
    return null;
  }
}

export async function reduceUserCredit() {
  try {
    const user = globalConfig.get('airtableuserid');
    if (user && user.credits > 0) {
      const updatedCredits = user.credits - 1;
      const response = await fetch(
        `https://app.nocodb.com/api/v2/tables/m845htjqz88twli/records`,
        {
          method: 'PATCH',
          headers: {
            accept: 'application/json',
            'xc-token': env.DATABASE_TOKEN,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Id: user.id,
            Credits: updatedCredits,
          }),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        await globalConfig.setAsync('airtableuserid', {
          ...user,
          credits: updatedCredits,
        });
      } else {
        throw new Error('Error reducing user credit');
      }
    } else {
      throw new Error('User not found or insufficient credits.');
    }
  } catch (error) {
    console.error('Error reducing user credit:', error);
  }
}