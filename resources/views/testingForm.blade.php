<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <form action="{{ route('ff-regis') }}" method="post" enctype="multipart/form-data">
        @csrf
        <h1>Team</h1>
        <input type="text" name="team_name">
        <input type="file" name="team_logo" id="">
        <input type="file" name="proof_of_payment" id="">

        <h1>Ketua</h1>
        <input type="text" name="name" placeholder="Name">
        <input type="text" name="nickname" placeholder="nickname">
        <input type="text" name="id_server" placeholder="id_server">
        <input type="text" name="no_hp" placeholder="no_hp">
        <input type="text" name="email" placeholder="email">
        <input type="text" name="alamat" placeholder="alamat">
        <input type="file" name="tanda_tangan" id="">
        <input type="file" name="foto" id="">

        <h1>Player 2</h1>
        <input type="text" name="name2" placeholder="Name">
        <input type="text" name="nickname2" placeholder="nickname">
        <input type="text" name="id_server2" placeholder="id_server">
        <input type="text" name="no_hp2" placeholder="no_hp">
        <input type="text" name="email2" placeholder="email">
        <input type="text" name="alamat2" placeholder="alamat">
        <input type="file" name="tanda_tangan2" id="">
        <input type="file" name="foto2" id="">
        
        <h1>Player 3</h1>
        <input type="text" name="name3" placeholder="Name">
        <input type="text" name="nickname3" placeholder="nickname">
        <input type="text" name="id_server3" placeholder="id_server">
        <input type="text" name="no_hp3" placeholder="no_hp">
        <input type="text" name="email3" placeholder="email">
        <input type="text" name="alamat3" placeholder="alamat">
        <input type="file" name="tanda_tangan3" id="">
        <input type="file" name="foto3" id="">
        
        <h1>Player 4</h1>
        <input type="text" name="name4" placeholder="Name">
        <input type="text" name="nickname4" placeholder="nickname">
        <input type="text" name="id_server4" placeholder="id_server">
        <input type="text" name="no_hp4" placeholder="no_hp">
        <input type="text" name="email4" placeholder="email">
        <input type="text" name="alamat4" placeholder="alamat">
        <input type="file" name="tanda_tangan4" id="">
        <input type="file" name="foto4" id="">
        <button type="submit">Kirim</button>
    </form>
</body>
</html>