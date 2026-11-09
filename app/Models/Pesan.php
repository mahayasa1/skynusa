<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pesan extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'telp',
        'judul',
        'isi',
    ];
}
