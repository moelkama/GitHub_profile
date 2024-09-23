var d = null;

function repo_component(r) {
    console.log(r);
    var description = '';
    if (r.description)
        description = r.description
    return `<a href="${r.html_url}" target="_blank" class="transition duration-1000 ease-linear hover:from-[#2f3859] hover:to-[#39386f] p-4 bg-yellow-600 rounded-xl w-11/12 bg-gradient-to-r from-[#111629] to-[#1c1b46]">
                <div class="flex flex-col gap-1">
                    <h1 class="text-[#a9b0bd]">${r.name}</h1>
                    <h1 class="text-[#727b93]">${description}</h1>
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
            </a>`;
}

function display_all_repos()
{
    if (d)
    {
        clean_repos();
        var repos = document.createElement('div');
        repos.className = 'w-full grid grid-cols-1 md:grid-cols-2 align-center my-6 gap-6';
        d.forEach(element => {
            repos.innerHTML += repo_component(element);
        });
        document.getElementById('repos-container-id').appendChild(repos);
    }
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
            d = data;
            var repos = document.createElement('div');
            repos.id = 'repos-id';
            repos.className = 'w-full grid grid-cols-1 md:grid-cols-2 align-center my-6 gap-6';
            for (let i = 0; i < data.length && i < 4; i++)
                repos.innerHTML += repo_component(data[i]);
            document.getElementById('repos-container-id').appendChild(repos);
            if (data.length > 4)
            {
                var elem = document.createElement('div');
                elem.className = 'w-full flex items-center justify-center my-4';
                elem.innerHTML = `<button onclick="display_all_repos()" class="text-white">+${data.length - 4} more</button>`;
                document.getElementById('repos-container-id').appendChild(elem);
            }
        })
}

function    clean_repos()
{
    document.getElementById('repos-container-id').innerHTML = '';
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('search-id').addEventListener('submit', (e) =>{
        e.preventDefault();
        const user = e.target[0].value;
        // var user = 'moelkama';
        clean_repos();
        fetch_user_info(user);
    })
});

//#e55897
//#bb6ae6