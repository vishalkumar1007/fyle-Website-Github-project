const axios = require('axios');

const all_data = async (req, res) => {
    const { user_id } = req.query;
    try {
        const response = await axios.get(`https://api.github.com/users/${user_id}`);

        res.json(response.data);
    } catch (error) {
        // Handle errors
        console.error('Error fetching GitHub data:', error.message);
        res.status(500).json({ error: 'Internal Server Error In All_Data' });
    }
};

const all_repo_data = async (req, res) => {
    const { user_id } = req.query;
    try {
        const response = await axios.get(`https://api.github.com/users/${user_id}/repos`);

        const mydata = response.data;
        res.json({ mydata, data_length: response.data.length });
    } catch (error) {
        // Handle errors
        console.error('Error fetching GitHub data:', error.message);
        res.status(500).json({ error: 'Internal Server Error In All_repo_Data ' });
    }
};

const limited_repo_data = async (req, res) => {
    // const { user_id ,limit} = req.query;
    let user_id = (req.query.user_id);
    let limit = Number(req.query.limit) || 3;
    try {

        const response = await axios.get(`https://api.github.com/users/${user_id}/repos?per_page=${limit}`);

        const mydata = response.data;
        res.json({ mydata, data_length: response.data.length });
    } catch (error) {
        // Handle errors
        console.error('Error fetching GitHub data:', error.message);
        res.status(500).json({ error: 'Internal Server Error In Limited_Repo_Data' });
    }
};

const pagination_repo_data = async (req, res) => {

    let user_id = req.query.user_id;

    try {
        const response = await axios.get(`https://api.github.com/users/${user_id}/repos`);
        const repoData = response.data;
        let limit = Number(req.query.limit) || 3;
        limit = limit > repoData.length ? repoData.length : limit;

        let page_no = Number(req.query.page_no) || 1;

        let page_handel_error = limit * page_no;
        let len = repoData.length;
        page_no = (len - page_handel_error) > ((-1) * limit) ? page_no : -1;

        if (page_no === -1) {
            limit_arlert(res);
            return;
        }


        const startIndex = (page_no - 1) * limit;
        const paginatedData = repoData.slice(startIndex, startIndex + limit);

        const extractedData = paginatedData.map(repo => {
            const { name, description, language, alert } = repo;
            return { name, description, language };
        });

        res.json({ data: extractedData, data_length: paginatedData.length });

    } catch (error) {
        console.error('Error fetching GitHub data:', error.message);
        res.status(500).json({ error: 'Internal Server Error In Pagination_Repo_Data' });
    }
};

function limit_arlert(res) {
    try {
        const alert = {
            "alert": "data_limit_reach"
        }
        res.json({ data: alert });
    } catch (error) {
        console.error('Error fetching GitHub data:', error.message);
        res.status(500).json({ error: 'Internal Server Error In alert' });
    }
    return;
}


const user_profile_data = async (req, res) => {
    const { user_id } = req.query;
    try {
        const response = await axios.get(`https://api.github.com/users/${user_id}`);
        const { avatar_url, name, login, public_repos, followers, following, location, bio } = response.data;
        const userData = {
            avatar_url,
            name,
            login,
            public_repos,
            followers,
            following,
            location,
            bio
        };

        res.json(userData);
    } catch (error) {
        // Handle errors
        console.error('Error fetching GitHub data:', error.message);
        res.status(500).json({ error: 'Internal Server Error In User_Profile_Data' });
    }
}


module.exports = {
    all_data,
    all_repo_data,
    limited_repo_data,
    pagination_repo_data,
    user_profile_data
};
