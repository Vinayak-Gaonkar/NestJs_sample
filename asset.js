var Base_url = 'http://localhost:3000';
var current_user;
var limit = 2,
  page = 0;

const createUser = async (event) => {
  event.preventDefault();

  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;

  let response = await fetch(`${Base_url}/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      firstName: firstName,
      lastName: lastName,
    }),
  });
  if (response.ok) {
    let result = await response.json();
    current_user = result;
    $('#add-user').remove();
    showFileInput();
    console.log('result', result);
  } else {
    alert('HTTP-Error: ' + response.status);
  }

  //   let response = await fetch(`${Base_url}/user`);

  //   if (response.ok) {
  //     // if HTTP-status is 200-299
  //     // get the response body (the method explained below)
  //     let json = await response.json();
  //     console.log(json);
  //   } else {
  //     alert('HTTP-Error: ' + response.status);
  //   }

  console.log(firstName, lastName);
};

const showFileInput = () => {
  $('#upload').append(`<form onsubmit="onFileSubmit(event)">
  <input id="fileUpload" name="fileUpload" type="file" />
  <button>Submit</button>
  </form>`);
};

const renderTable = (fileList) => {
  $('#table').find('tr:gt(0)').remove();

  for (let i = 0; i < fileList.allFiles.length; i++) {
    // console.log(fileList[i].fileName);
    $('#table tr:last').after(`<tr>
    <td>${fileList.allFiles[i].fileName}</td>
    <td>${fileList.allFiles[i].description}</td>
    </tr>`);
  }
};

const renderPagination = (totalCount = 0) => {
  $('ul').empty();
  for (let i = 0; i < totalCount / limit; i++) {
    $('ul').append(
      `<li class="page-item" onClick=changePage(${i + 1}) id=${
        i + 1
      }><a class="page-link" href="#">${i + 1}</a></li>`,
    );
  }
};

const changePage = async (index) => {
  //   console.log(index);
  page = Number(index) - 1;
  let fileList = await GetFiles();
  renderTable(fileList);
  renderPagination(fileList.totalcount);
};

const onFileSubmit = async (event) => {
  event.preventDefault();
  const files = document.getElementById('fileUpload').files;
  console.log(files);
  await uploadFile(files);
  let fileList = await GetFiles();
  renderTable(fileList);
  renderPagination(fileList.totalcount);
};

const uploadFile = async (files) => {
  var formdata = new FormData();
  formdata.append('image', files[0], 'Screenshot from 2022-09-29 22-55-52.png');
  formdata.append('name', current_user.firstName);
  formdata.append('description', 'This is test');

  var requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow',
  };

  const response = await fetch(
    'http://localhost:3000/user/singlefile',
    requestOptions,
  );
  return response;
};

const GetFiles = async () => {
  try {
    const availableFiles = await fetch(
      `http://localhost:3000/user/${current_user.firstName}?page=${page}&limit=${limit}`,
    );
    return availableFiles.json();
  } catch (error) {
    throw error;
  }
};
