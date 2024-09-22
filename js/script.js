var data = null;

function repo_component(r) {
    return `<div class="p-4 bg-yellow-600 rounded-xl w-11/12 bg-gradient-to-r from-[#111629] to-[#1c1b46]">
                <div class="flex flex-col gap-1">
                    <h1 class="text-[#a9b0bd]">${r.name}</h1>
                    <h1 class="text-[#727b93]">Placeat deserunt alias quae blanditiis</h1>
                </div>
                <div class="flex gap-4">
                    <div class="flex items-center gap-1">
                        <i class="fa-solid fa-code-fork text-[#8e939f]"></i>
                        <h1 id="fork-count-id" class="text-[#8e939f]">${r.forks_count}</h1>
                    </div>
                    <div class="flex items-center gap-1">
                        <i class="fa-regular fa-star text-[#8e939f]"></i>
                        <h1 class="text-[#8e939f]">${r.stargazers_count}</h1>
                    </div>
                    <div class="flex items-center gap-1">
                        <h1 class="text-sm text-[#8e939f]">updated ${r.updated_at} ago</h1>
                    </div>
                </div>
            </div>`;
}

function display_all_repos()
{
    data.forEach(element => {
        repos.appendChild(repo_component(element));
    });
}

function    fetch_user_info(user)
{
    fetch(`https://api.github.com/users/${user}`)
        .then(response => {
            if (response.ok)
                return response.json()
            else
                throw 'Not Found';
        })
        .then(data => {
            console.log(data);
            if (data.avatar_url)
                document.getElementById('avatar-id').src = data.avatar_url;
            else
                document.getElementById('avatar-id').src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhZGUAlyTIsItIo008ezD9zclGktUI1BOizscUd5lTo2ZWPQCBTfhnjZAw07hs1ErrnuY&usqp=CAU";
            document.getElementById('followers-id').innerHTML = data.followers;
            document.getElementById('following-id').innerHTML = data.following;
            if (data.location)
                document.getElementById('location-id').innerHTML = data.location;
            else
                document.getElementById('location-id').innerHTML = "Not Set";
            fetch_repos(user);
        })
        .catch(err => {
            console.log('===================');
            clean_repos();
            const elem = document.createElement('div');
            elem.className = 'w-full h-80 flex items-center justify-center';
            var user_name = user;
            if (user_name.length > 15)
                user_name =  user_name.slice(0, 15) + '...';
            elem.innerHTML = `<h1 class="font-bold text-4xl	 text-red-500">${err}: <span class="text-white">"${user_name}"</span></h1>`;
            document.getElementById('repos-container-id').appendChild(elem);});
}

function fetch_repos(user) {
    fetch(`https://api.github.com/users/${user}/repos`)
        .then(response => response.json())
        .then(data => {
            clean_repos();
            data = data;
            const repos = document.createElement('div');
            repos.className = 'w-full grid grid-cols-2 align-center my-6 gap-6';
            for (let i = 0; i < data.length && i < 4; i++) {
                const r = data[i];
                const repo = document.createElement('div');
                repo.innerHTML = repo_component(r);
                repos.appendChild(repo);
            };
            document.getElementById('repos-container-id').appendChild(repos);
            // if (data.length > 4)
            // {
            //     const elem = document.createElement('div');
            //     elem.className = 'w-full flex items-center p-4';
            //     elem.innerHTML = `<button onclick="display_all_repos()" class="text-white">+${data.length - 4} more</button>`;
            //     repos.appendChild(elem);
            // }
        })
}

function    clean_repos()
{
    if (document.getElementById('repos-container-id'))
        document.getElementById('repos-container-id').innerHTML = '';
}

document.addEventListener('DOMContentLoaded', () => {
    // fetch(`https://api.github.com/users/moelkama`)
    document.getElementById('search-id').addEventListener('submit', (e) =>{
        e.preventDefault();
        const user = e.target[0].value;
        clean_repos();
        fetch_user_info(user);
        const loader = document.createElement('div');
        loader.innerHTML = `<l-dot-wave size="90" speed="1" color="black" ></l-dot-wave>`;
        loader.className = "w-full h-80 flex items-center justify-center";
        document.getElementById('repos-container-id').appendChild(loader);
    })
});