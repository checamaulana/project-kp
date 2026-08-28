# Backend Structure (BACKEND_STRUCTURE)
## SIM SURAT RSGM UNIMUS

**Versi:** 1.0
**Tanggal:** 2026-08-27
**Referensi:** PRD.md, APP_FLOW.md, TECH_STACK.md, AGENTS.md, Laravel 12 docs

---

## 1. Prinsip Dasar

1. **Laravel 12 streamlined structure** — tidak ada `app/Http/Kernel.php`, konfigurasi di `bootstrap/app.php`.
2. **Service Layer Pattern** — business logic di Services, Controllers hanya orchestrate.
3. **Form Request Validation** — semua validasi di FormRequest, bukan inline di controller.
4. **Eloquent over Query Builder** — kecuali untuk query yang sangat kompleks.
5. **PHP 8 constructor property promotion** — tidak ada constructor kosong tanpa parameter.
6. **Explicit return types** — semua method harus ada return type declaration.
7. **PHPDoc blocks** — bukan inline comments.
8. **Eager loading** — selalu hindari N+1.
9. **Wayfinder** — untuk type-safe routes dari frontend.
10. **Pest untuk testing** — bukan PHPUnit (meskipun underlying-nya PHPUnit 11).

---

## 2. Struktur Direktori Backend

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Controller.php                  # Base controller
│   │   ├── Auth/
│   │   │   ├── AuthenticatedSessionController.php
│   │   │   ├── RegisteredUserController.php
│   │   │   ├── PasswordResetLinkController.php
│   │   │   ├── NewPasswordController.php
│   │   │   └── PasswordController.php       # Ganti password
│   │   ├── ProfileController.php
│   │   ├── SuratMasukController.php
│   │   ├── SuratKeluarController.php
│   │   ├── DisposisiController.php
│   │   ├── PelayananController.php
│   │   ├── PelayananProgressController.php
│   │   ├── RekapController.php
│   │   ├── NotifikasiController.php
│   │   ├── SessionController.php            # Untuk toggle tahun
│   │   └── Admin/
│   │       ├── UserController.php
│   │       ├── UnitController.php
│   │       ├── KodeSuratController.php
│   │       ├── IndeksController.php
│   │       └── AuditLogController.php
│   ├── Middleware/
│   │   ├── HandleInertiaRequests.php        # Default
│   │   ├── EnsureUserActive.php             # Custom
│   │   ├── CheckRole.php                    # Custom
│   │   └── SetActiveYear.php                # Custom
│   ├── Requests/
│   │   ├── Auth/
│   │   │   ├── LoginRequest.php
│   │   │   ├── RegisterRequest.php
│   │   │   └── ...
│   │   ├── SuratMasukStoreRequest.php
│   │   ├── SuratMasukUpdateRequest.php
│   │   ├── SuratKeluarStoreRequest.php
│   │   ├── SuratKeluarUpdateRequest.php
│   │   ├── SuratKeluarApprovalRequest.php
│   │   ├── DisposisiStoreRequest.php
│   │   ├── PelayananStoreRequest.php
│   │   └── PelayananProgressRequest.php
│   └── Resources/                           # Untuk API (jika ada)
│       └── ...
├── Models/
│   ├── User.php
│   ├── Unit.php
│   ├── KodeSurat.php
│   ├── Indeks.php
│   ├── SuratMasuk.php
│   ├── SuratKeluar.php
│   ├── Disposisi.php
│   ├── Pelayanan.php
│   ├── PelayananProgress.php
│   └── AuditLog.php
├── Observers/
│   ├── UserObserver.php
│   ├── SuratMasukObserver.php
│   ├── SuratKeluarObserver.php
│   ├── DisposisiObserver.php
│   └── PelayananObserver.php
├── Services/
│   ├── SuratMasukService.php
│   ├── SuratKeluarService.php
│   ├── DisposisiService.php
│   ├── PelayananService.php
│   ├── NotifikasiService.php
│   ├── NomorSuratGenerator.php
│   ├── PdfGeneratorService.php
│   └── ExcelExportService.php
├── Notifications/
│   ├── SuratMasukBaruNotification.php
│   ├── DisposisiBaruNotification.php
│   ├── DisposisiDiteruskanNotification.php
│   ├── SuratKeluarApprovedNotification.php
│   ├── SuratKeluarRejectedNotification.php
│   ├── PelayananBaruNotification.php
│   ├── PelayananProgressNotification.php
│   └── UserPendingApprovalNotification.php
├── Enums/
│   ├── RoleEnum.php
│   ├── StatusSuratMasukEnum.php
│   ├── StatusSuratKeluarEnum.php
│   ├── StatusPelayananEnum.php
│   ├── AksiDisposisiEnum.php
│   ├── StatusDisposisiEnum.php
│   └── StatusUserEnum.php
├── Policies/
│   ├── SuratMasukPolicy.php
│   ├── SuratKeluarPolicy.php
│   ├── DisposisiPolicy.php
│   ├── PelayananPolicy.php
│   └── UserPolicy.php
├── Exceptions/
│   ├── Handler.php                          # Custom (override default)
│   ├── SuratTidakFoundException.php
│   └── UnauthorizedActionException.php
└── Providers/
    ├── AppServiceProvider.php
    └── AuthServiceProvider.php

bootstrap/
├── app.php                                  # Laravel 12 main config
└── providers.php

config/
├── app.php
├── audit.php                                # Custom config
├── auth.php
├── cache.php
├── database.php
├── filesystems.php
├── inertia.php
├── logging.php
├── mail.php
├── queue.php
├── services.php
└── session.php

database/
├── factories/
│   ├── UserFactory.php
│   ├── UnitFactory.php
│   ├── KodeSuratFactory.php
│   ├── IndeksFactory.php
│   ├── SuratMasukFactory.php
│   ├── SuratKeluarFactory.php
│   ├── DisposisiFactory.php
│   ├── PelayananFactory.php
│   └── AuditLogFactory.php
├── migrations/
│   ├── 0001_01_01_000000_create_users_table.php
│   ├── 0001_01_01_000001_create_cache_table.php
│   ├── 0001_01_01_000002_create_jobs_table.php
│   ├── 2025_08_14_170933_add_two_factor_columns_to_users_table.php
│   ├── 2026_08_27_100000_create_units_table.php
│   ├── 2026_08_27_100001_create_kode_surats_table.php
│   ├── 2026_08_27_100002_create_indeks_table.php
│   ├── 2026_08_27_100003_create_surat_masuks_table.php
│   ├── 2026_08_27_100004_create_surat_keluars_table.php
│   ├── 2026_08_27_100005_create_disposisis_table.php
│   ├── 2026_08_27_100006_create_pelayanans_table.php
│   ├── 2026_08_27_100007_create_pelayanan_progress_table.php
│   ├── 2026_08_27_100008_create_audit_logs_table.php
│   └── 2026_08_27_100009_add_soft_deletes_to_surat_tables.php
└── seeders/
    ├── DatabaseSeeder.php
    ├── UserSeeder.php                       # Default superadmin
    ├── UnitSeeder.php                       # 12 unit default
    ├── KodeSuratSeeder.php                  # Kode UNIMUS, RSGM
    └── IndeksSeeder.php                     # Indeks default

routes/
├── web.php
├── console.php
└── auth.php

storage/
├── app/
│   ├── private/
│   │   └── surat/{tahun}/{file_hash}.{ext}
│   └── public/
├── framework/
│   ├── cache/data/
│   ├── sessions/
│   ├── testing/
│   └── views/
└── logs/
    └── laravel.log

tests/
├── Pest.php
├── TestCase.php
├── Feature/
│   ├── Auth/
│   │   ├── AuthenticationTest.php
│   │   ├── RegistrationTest.php
│   │   ├── PasswordResetTest.php
│   │   └── ...
│   ├── SuratMasuk/
│   │   ├── CreateSuratMasukTest.php
│   │   ├── UpdateSuratMasukTest.php
│   │   ├── DeleteSuratMasukTest.php
│   │   └── ViewSuratMasukTest.php
│   ├── SuratKeluar/
│   │   ├── CreateSuratKeluarTest.php
│   │   ├── ApprovalFlowTest.php
│   │   └── ...
│   ├── Disposisi/
│   │   ├── CreateDisposisiTest.php
│   │   ├── MultiRouteTest.php
│   │   └── ...
│   ├── Pelayanan/
│   │   └── ...
│   ├── Rekap/
│   │   └── ...
│   └── Notifikasi/
│       └── ...
└── Unit/
    ├── Services/
    │   ├── NomorSuratGeneratorTest.php
    │   ├── SuratMasukServiceTest.php
    │   └── ...
    └── Models/
        └── ...
```

---

## 3. Models (Eloquent)

### 3.1 User Model

```php
<?php

namespace App\Models;

use App\Enums\RoleEnum;
use App\Enums\StatusUserEnum;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'username',
        'name',
        'email',
        'password',
        'unit_id',
        'role',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => RoleEnum::class,
            'status' => StatusUserEnum::class,
        ];
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    public function isActive(): bool
    {
        return $this->status === StatusUserEnum::ACTIVE;
    }

    public function hasRole(RoleEnum $role): bool
    {
        return $this->role === $role;
    }

    public function canApproveSuratKeluar(): bool
    {
        return $this->role === RoleEnum::SUPERADMIN;
    }
}
```

### 3.2 Unit Model

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Unit extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['kode', 'nama', 'keterangan', 'is_active'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
```

### 3.3 SuratMasuk Model

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class SuratMasuk extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'surat_masuks';

    protected $fillable = [
        'no_urut',
        'tahun',
        'tanggal_terima',
        'tanggal_surat',
        'nomor_surat',
        'pengirim',
        'perihal',
        'keterangan',
        'indeks_id',
        'file_path',
        'file_name',
        'unit_penerima_id',
        'created_by',
        'updated_by',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_terima' => 'date',
            'tanggal_surat' => 'date',
            'tahun' => 'integer',
            'no_urut' => 'integer',
        ];
    }

    public function indeks(): BelongsTo
    {
        return $this->belongsTo(Indeks::class);
    }

    public function unitPenerima(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'unit_penerima_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function disposisis(): HasMany
    {
        return $this->hasMany(Disposisi::class)->orderBy('created_at');
    }

    public function latestDisposisi(): ?Disposisi
    {
        return $this->disposisis()->latest()->first();
    }
}
```

### 3.4 SuratKeluar Model

```php
<?php

namespace App\Models;

use App\Enums\StatusSuratKeluarEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class SuratKeluar extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'surat_keluars';

    protected $fillable = [
        'no_urut',
        'tahun',
        'nomor_surat',
        'kode_surat_id',
        'indeks_id',
        'kode_turunan',
        'tanggal_surat',
        'kepada',
        'perihal',
        'penanda_tangan',
        'tembusan',
        'keterangan',
        'tanggal_mulai_penugasan',
        'tanggal_selesai_penugasan',
        'file_path',
        'file_name',
        'unit_pembuat_id',
        'created_by',
        'status',
        'approved_by',
        'approved_at',
        'rejection_reason',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_surat' => 'date',
            'tanggal_mulai_penugasan' => 'date',
            'tanggal_selesai_penugasan' => 'date',
            'approved_at' => 'datetime',
            'status' => StatusSuratKeluarEnum::class,
        ];
    }

    public function kodeSurat(): BelongsTo
    {
        return $this->belongsTo(KodeSurat::class);
    }

    public function indeks(): BelongsTo
    {
        return $this->belongsTo(Indeks::class);
    }

    public function unitPembuat(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'unit_pembuat_id');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function isEditable(): bool
    {
        return in_array($this->status, [
            StatusSuratKeluarEnum::DRAFT,
            StatusSuratKeluarEnum::DITOLAK,
        ]);
    }

    public function isApprovable(): bool
    {
        return $this->status === StatusSuratKeluarEnum::MENUNGGU_ACC;
    }
}
```

### 3.5 Disposisi Model

```php
<?php

namespace App\Models;

use App\Enums\AksiDisposisiEnum;
use App\Enums\StatusDisposisiEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Disposisi extends Model
{
    use HasFactory;

    protected $table = 'disposisis';

    protected $fillable = [
        'surat_masuk_id',
        'parent_id',
        'dari_user_id',
        'kepada_user_id',
        'kepada_unit_id',
        'isi',
        'aksi',
        'status',
        'dibaca_at',
        'selesai_at',
    ];

    protected function casts(): array
    {
        return [
            'aksi' => AksiDisposisiEnum::class,
            'status' => StatusDisposisiEnum::class,
            'dibaca_at' => 'datetime',
            'selesai_at' => 'datetime',
        ];
    }

    public function suratMasuk(): BelongsTo
    {
        return $this->belongsTo(SuratMasuk::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Disposisi::class, 'parent_id');
    }

    public function children(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Disposisi::class, 'parent_id');
    }

    public function dari(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dari_user_id');
    }

    public function kepada(): BelongsTo
    {
        return $this->belongsTo(User::class, 'kepada_user_id');
    }

    public function kepadaUnit(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'kepada_unit_id');
    }
}
```

### 3.6 Pelayanan Model

```php
<?php

namespace App\Models;

use App\Enums\StatusPelayananEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pelayanan extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'pelayanans';

    protected $fillable = [
        'judul',
        'jenis_pelayanan',
        'aplikasi',
        'detail',
        'pengaju_id',
        'unit_pengaju_id',
        'handler_id',
        'status',
        'lampiran',
        'closed_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => StatusPelayananEnum::class,
            'lampiran' => 'array',
            'closed_at' => 'datetime',
        ];
    }

    public function pengaju(): BelongsTo
    {
        return $this->belongsTo(User::class, 'pengaju_id');
    }

    public function unitPengaju(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'unit_pengaju_id');
    }

    public function handler(): BelongsTo
    {
        return $this->belongsTo(User::class, 'handler_id');
    }

    public function progress(): HasMany
    {
        return $this->hasMany(PelayananProgress::class)->orderBy('created_at');
    }
}
```

### 3.7 AuditLog Model

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class AuditLog extends Model
{
    use HasFactory;

    protected $table = 'audit_logs';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'action',
        'model_type',
        'model_id',
        'before',
        'after',
        'ip_address',
        'user_agent',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'before' => 'array',
            'after' => 'array',
            'created_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function model(): MorphTo
    {
        return $this->morphTo();
    }
}
```

---

## 4. Enums (PHP 8.1+ Backed Enums)

### 4.1 RoleEnum

```php
<?php

namespace App\Enums;

enum RoleEnum: string
{
    case SUPERADMIN = 'superadmin';
    case ADMIN_TU = 'admin_tu';
    case KEPALA_UNIT = 'kepala_unit';
    case STAF = 'staf';

    public function label(): string
    {
        return match ($this) {
            self::SUPERADMIN => 'Superadmin',
            self::ADMIN_TU => 'Admin TU',
            self::KEPALA_UNIT => 'Kepala Unit',
            self::STAF => 'Staf',
        };
    }
}
```

### 4.2 StatusSuratKeluarEnum

```php
<?php

namespace App\Enums;

enum StatusSuratKeluarEnum: string
{
    case DRAFT = 'draft';
    case MENUNGGU_ACC = 'menunggu_acc';
    case DISETUJUI = 'disetujui';
    case DITOLAK = 'ditolak';

    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Draft',
            self::MENUNGGU_ACC => 'Menunggu ACC',
            self::DISETUJUI => 'Disetujui',
            self::DITOLAK => 'Ditolak',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::DRAFT => 'muted',
            self::MENUNGGU_ACC => 'warning',
            self::DISETUJUI => 'success',
            self::DITOLAK => 'destructive',
        };
    }
}
```

### 4.3 StatusPelayananEnum

```php
<?php

namespace App\Enums;

enum StatusPelayananEnum: string
{
    case WAITING = 'waiting';
    case ACCEPTED = 'accepted';
    case IN_PROGRESS = 'in_progress';
    case REJECTED = 'rejected';
    case CLOSED = 'closed';

    public function label(): string
    {
        return match ($this) {
            self::WAITING => 'Waiting',
            self::ACCEPTED => 'Accepted',
            self::IN_PROGRESS => 'In Progress',
            self::REJECTED => 'Rejected',
            self::CLOSED => 'Closed',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::WAITING => 'warning',
            self::ACCEPTED => 'success',
            self::IN_PROGRESS => 'info',
            self::REJECTED => 'destructive',
            self::CLOSED => 'muted',
        };
    }
}
```

### 4.4 AksiDisposisiEnum

```php
<?php

namespace App\Enums;

enum AksiDisposisiEnum: string
{
    case DI_DISPOSISI = 'di_disposisi';
    case DI_ARSIPKAN = 'di_arsipkan';

    public function label(): string
    {
        return match ($this) {
            self::DI_DISPOSISI => 'Di Disposisi',
            self::DI_ARSIPKAN => 'Di Arsipkan',
        };
    }
}
```

---

## 5. Form Requests (Validation)

### 5.1 LoginRequest

```php
<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'username.required' => 'Username wajib diisi.',
            'password.required' => 'Password wajib diisi.',
        ];
    }

    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $user = \App\Models\User::where('username', $this->input('username'))->first();

        if (! $user || ! \Hash::check($this->input('password'), $user->password)) {
            RateLimiter::hit($this->throttleKey());
            throw ValidationException::withMessages([
                'username' => 'Username atau password salah.',
            ]);
        }

        if ($user->status !== \App\Enums\StatusUserEnum::ACTIVE) {
            throw ValidationException::withMessages([
                'username' => 'Akun Anda belum aktif. Hubungi admin.',
            ]);
        }

        \Auth::login($user, $this->boolean('remember'));
        RateLimiter::clear($this->throttleKey());
    }

    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }
        throw ValidationException::withMessages([
            'username' => 'Terlalu banyak percobaan login. Coba lagi dalam 1 menit.',
        ]);
    }

    public function throttleKey(): string
    {
        return 'login:' . $this->ip();
    }
}
```

### 5.2 RegisterRequest

```php
<?php

namespace App\Http\Requests\Auth;

use App\Enums\RoleEnum;
use App\Enums\StatusUserEnum;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => ['required', 'string', 'min:3', 'max:100', 'unique:users,username', 'regex:/^[a-zA-Z0-9._-]+$/'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(8)],
            'unit_id' => ['required', 'exists:units,id'],
            'role' => ['required', Rule::in([RoleEnum::KEPALA_UNIT->value, RoleEnum::STAF->value])], // Hanya role ini yang bisa dipilih saat register
        ];
    }

    public function messages(): array
    {
        return [
            'username.regex' => 'Username hanya boleh mengandung huruf, angka, titik, underscore, dan strip.',
            'username.unique' => 'Username sudah digunakan.',
            'email.unique' => 'Email sudah terdaftar.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'role.in' => 'Role yang dipilih tidak valid. Superadmin dan Admin TU hanya dapat dibuat oleh superadmin.',
        ];
    }
}
```

### 5.3 SuratMasukStoreRequest

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SuratMasukStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null; // Sudah pasti auth via middleware
    }

    public function rules(): array
    {
        return [
            'tanggal_terima' => ['required', 'date'],
            'tanggal_surat' => ['required', 'date', 'before_or_equal:tanggal_terima'],
            'nomor_surat' => ['required', 'string', 'max:100'],
            'pengirim' => ['required', 'string', 'max:255'],
            'perihal' => ['required', 'string', 'max:255'],
            'keterangan' => ['nullable', 'string', 'max:1000'],
            'indeks_id' => ['nullable', 'exists:indeks,id'],
            'file' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'], // 10MB
        ];
    }

    public function messages(): array
    {
        return [
            'tanggal_surat.before_or_equal' => 'Tanggal surat tidak boleh setelah tanggal terima.',
            'file.required' => 'File surat wajib diupload.',
            'file.mimes' => 'File harus berformat PDF, JPG, atau PNG.',
            'file.max' => 'Ukuran file maksimal 10MB.',
        ];
    }
}
```

### 5.4 SuratKeluarStoreRequest

```php
<?php

namespace App\Http\Requests;

use App\Models\Indeks;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SuratKeluarStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\SuratKeluar::class);
    }

    public function rules(): array
    {
        $indeks = $this->input('indeks_id') ? Indeks::find($this->input('indeks_id')) : null;
        $isSuratTugas = $indeks?->kode === 'ST';

        $rules = [
            'indeks_id' => ['required', 'exists:indeks,id'],
            'tanggal_surat' => ['required', 'date'],
            'kepada' => ['required', 'string', 'max:255'],
            'perihal' => ['required', 'string', 'max:255'],
            'penanda_tangan' => ['required', 'string', 'max:255'],
            'tembusan' => ['nullable', 'string', 'max:1000'],
            'keterangan' => ['nullable', 'string', 'max:1000'],
            'file' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'],
        ];

        if ($isSuratTugas) {
            $rules['kode_turunan'] = ['required', Rule::in(['KP', 'KM'])];
            $rules['tanggal_mulai_penugasan'] = ['required', 'date'];
            $rules['tanggal_selesai_penugasan'] = ['required', 'date', 'after_or_equal:tanggal_mulai_penugasan'];
        } else {
            $rules['kode_turunan'] = ['nullable'];
            $rules['tanggal_mulai_penugasan'] = ['nullable', 'date'];
            $rules['tanggal_selesai_penugasan'] = ['nullable', 'date'];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'kode_turanan.in' => 'Untuk Surat Tugas, kode turunan harus KP atau KM.',
            'tanggal_selesai_penugasan.after_or_equal' => 'Tanggal selesai harus setelah atau sama dengan tanggal mulai.',
        ];
    }
}
```

### 5.5 DisposisiStoreRequest

```php
<?php

namespace App\Http\Requests;

use App\Enums\AksiDisposisiEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DisposisiStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $aksi = $this->input('aksi');

        $rules = [
            'surat_masuk_id' => ['required', 'exists:surat_masuks,id'],
            'aksi' => ['required', Rule::enum(AksiDisposisiEnum::class)],
            'isi' => ['required', 'string', 'min:5', 'max:1000'],
        ];

        if ($aksi === AksiDisposisiEnum::DI_DISPOSISI->value) {
            $rules['kepada_user_id'] = ['required_without:kepada_unit_id', 'nullable', 'exists:users,id'];
            $rules['kepada_unit_id'] = ['required_without:kepada_user_id', 'nullable', 'exists:units,id'];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'isi.min' => 'Isi disposisi minimal 5 karakter.',
            'kepada_user_id.required_without' => 'Pilih user atau unit tujuan disposisi.',
        ];
    }
}
```

---

## 6. Services (Business Logic)

### 6.1 NomorSuratGenerator

```php
<?php

namespace App\Services;

use App\Models\SuratKeluar;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class NomorSuratGenerator
{
    /**
     * Generate nomor surat keluar otomatis.
     * Format: [KodeSurat]/[KodeUnit]/[Indeks][KodeTurunan][NoUrut]/[BulanRomawi]/[Tahun]
     * Contoh: UNIMUS/IT/ST/KP/001/VIII/2026
     */
    public function generate(
        int $kodeSuratId,
        int $unitId,
        int $indeksId,
        ?string $kodeTurunan = null
    ): string {
        return DB::transaction(function () use ($kodeSuratId, $unitId, $indeksId, $kodeTurunan) {
            $kodeSurat = \App\Models\KodeSurat::findOrFail($kodeSuratId);
            $unit = \App\Models\Unit::findOrFail($unitId);
            $indeks = \App\Models\Indeks::findOrFail($indeksId);
            $tahun = Carbon::now()->year;
            $bulanRomawi = $this->toRoman(Carbon::now()->month);

            // Lock row untuk no_urut
            $lastNo = SuratKeluar::where('tahun', $tahun)
                ->where('unit_pembuat_id', $unitId)
                ->lockForUpdate()
                ->max('no_urut');

            $noUrut = ($lastNo ?? 0) + 1;
            $noUrutFormatted = str_pad($noUrut, 3, '0', STR_PAD_LEFT);

            $kodeIndeks = $indeks->kode . ($kodeTurunan ? '.' . $kodeTurunan : '');

            return "{$kodeSurat->kode}/{$unit->kode}/{$kodeIndeks}/{$noUrutFormatted}/{$bulanRomawi}/{$tahun}";
        });
    }

    private function toRoman(int $num): string
    {
        $map = [
            1 => 'I', 2 => 'II', 3 => 'III', 4 => 'IV', 5 => 'V', 6 => 'VI',
            7 => 'VII', 8 => 'VIII', 9 => 'IX', 10 => 'X', 11 => 'XI', 12 => 'XII',
        ];
        return $map[$num];
    }
}
```

### 6.2 SuratMasukService

```php
<?php

namespace App\Services;

use App\Models\SuratMasuk;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class SuratMasukService
{
    public function __construct(
        private readonly NomorSuratGenerator $nomorGenerator,
    ) {}

    public function create(array $data, UploadedFile $file, int $userId): SuratMasuk
    {
        return DB::transaction(function () use ($data, $file, $userId) {
            $tahun = now()->year;

            // Auto-generate no_urut per tahun
            $lastNo = SuratMasuk::where('tahun', $tahun)->lockForUpdate()->max('no_urut');
            $noUrut = ($lastNo ?? 0) + 1;

            // Upload file
            $fileName = $file->getClientOriginalName();
            $fileHash = $file->hashName();
            $filePath = $file->storeAs("surat/{$tahun}", $fileHash, 'local');

            $surat = SuratMasuk::create([
                'no_urut' => $noUrut,
                'tahun' => $tahun,
                'tanggal_terima' => $data['tanggal_terima'],
                'tanggal_surat' => $data['tanggal_surat'],
                'nomor_surat' => $data['nomor_surat'],
                'pengirim' => $data['pengirim'],
                'perihal' => $data['perihal'],
                'keterangan' => $data['keterangan'] ?? null,
                'indeks_id' => $data['indeks_id'] ?? null,
                'file_path' => $filePath,
                'file_name' => $fileName,
                'unit_penerima_id' => $data['unit_penerima_id'] ?? auth()->user()->unit_id,
                'created_by' => $userId,
                'status' => 'aktif',
            ]);

            return $surat;
        });
    }

    public function update(SuratMasuk $surat, array $data, ?UploadedFile $file, int $userId): SuratMasuk
    {
        return DB::transaction(function () use ($surat, $data, $file, $userId) {
            $oldValues = $surat->toArray();

            if ($file) {
                // Hapus file lama
                Storage::disk('local')->delete($surat->file_path);
                $fileName = $file->getClientOriginalName();
                $fileHash = $file->hashName();
                $filePath = $file->storeAs("surat/{$surat->tahun}", $fileHash, 'local');
                $data['file_path'] = $filePath;
                $data['file_name'] = $fileName;
            }

            $data['updated_by'] = $userId;
            $surat->update($data);

            return $surat;
        });
    }

    public function delete(SuratMasuk $surat): bool
    {
        return $surat->delete(); // Soft delete
    }

    public function restore(int $id): SuratMasuk
    {
        $surat = SuratMasuk::onlyTrashed()->findOrFail($id);
        $surat->restore();
        return $surat;
    }

    /**
     * Purge surat yang sudah soft-deleted lebih dari 30 hari.
     * Dijalankan via scheduled command.
     */
    public function purgeOldTrashed(): int
    {
        $threshold = now()->subDays(30);
        $trashed = SuratMasuk::onlyTrashed()->where('deleted_at', '<', $threshold)->get();

        foreach ($trashed as $surat) {
            Storage::disk('local')->delete($surat->file_path);
            $surat->forceDelete();
        }

        return $trashed->count();
    }
}
```

### 6.3 DisposisiService

```php
<?php

namespace App\Services;

use App\Enums\AksiDisposisiEnum;
use App\Enums\StatusDisposisiEnum;
use App\Enums\StatusSuratMasukEnum;
use App\Models\Disposisi;
use App\Models\SuratMasuk;
use App\Models\User;
use App\Notifications\DisposisiBaruNotification;
use Illuminate\Support\Facades\DB;

class DisposisiService
{
    public function create(SuratMasuk $surat, User $dari, array $data): Disposisi
    {
        return DB::transaction(function () use ($surat, $dari, $data) {
            // Get parent disposisi (latest)
            $parent = $surat->disposisis()->latest()->first();

            $disposisi = Disposisi::create([
                'surat_masuk_id' => $surat->id,
                'parent_id' => $parent?->id,
                'dari_user_id' => $dari->id,
                'kepada_user_id' => $data['kepada_user_id'] ?? null,
                'kepada_unit_id' => $data['kepada_unit_id'] ?? null,
                'isi' => $data['isi'],
                'aksi' => $data['aksi'],
                'status' => StatusDisposisiEnum::PENDING,
            ]);

            // Update status surat
            if ($data['aksi'] === AksiDisposisiEnum::DI_ARSIPKAN->value) {
                $surat->update(['status' => StatusSuratMasukEnum::SELESAI]);
                $disposisi->update(['status' => StatusDisposisiEnum::SELESAI, 'selesai_at' => now()]);
            } else {
                $surat->update(['status' => StatusSuratMasukEnum::ON_ROUTE]);
            }

            // Kirim notifikasi
            $penerima = $disposisi->kepada_user_id
                ? User::find($disposisi->kepada_user_id)
                : null;

            if ($penerima) {
                $penerima->notify(new DisposisiBaruNotification($disposisi));
            }

            return $disposisi;
        });
    }
}
```

### 6.4 PdfGeneratorService

```php
<?php

namespace App\Services;

use App\Models\SuratMasuk;
use Barryvdh\DomPDF\Facade\Pdf;

class PdfGeneratorService
{
    public function generateLembarDisposisi(SuratMasuk $surat): \Barryvdh\DomPDF\PDF
    {
        $surat->load(['disposisis.dari', 'disposisis.kepada', 'indeks', 'unitPenerima']);

        $pdf = Pdf::loadView('pdf.lembar-disposisi', [
            'surat' => $surat,
            'tanggalCetak' => now()->format('d F Y'),
        ]);

        $pdf->setPaper('a4', 'landscape');

        return $pdf;
    }

    public function generateSuratKeluar(\App\Models\SuratKeluar $suratKeluar): \Barryvdh\DomPDF\PDF
    {
        $suratKeluar->load(['kodeSurat', 'indeks', 'unitPembuat', 'approvedBy']);

        $pdf = Pdf::loadView('pdf.surat-keluar', [
            'surat' => $suratKeluar,
        ]);

        $pdf->setPaper('a4', 'portrait');

        return $pdf;
    }
}
```

---

## 7. Controllers

### 7.1 SuratMasukController

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\SuratMasukStoreRequest;
use App\Http\Requests\SuratMasukUpdateRequest;
use App\Models\Indeks;
use App\Models\SuratMasuk;
use App\Services\PdfGeneratorService;
use App\Services\SuratMasukService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SuratMasukController extends Controller
{
    public function __construct(
        private readonly SuratMasukService $suratMasukService,
        private readonly PdfGeneratorService $pdfGenerator,
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $activeYear = session('active_year', now()->year);
        $perPage = $request->input('per_page', 25);

        $query = SuratMasuk::query()
            ->with(['indeks', 'unitPenerima', 'createdBy'])
            ->where('tahun', $activeYear)
            ->latest('tanggal_terima');

        // Filter by role/unit
        if (! $user->hasRole(\App\Enums\RoleEnum::SUPERADMIN) && ! $user->hasRole(\App\Enums\RoleEnum::ADMIN_TU)) {
            $query->where('unit_penerima_id', $user->unit_id);
        }

        // Search
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nomor_surat', 'like', "%{$search}%")
                    ->orWhere('pengirim', 'like', "%{$search}%")
                    ->orWhere('perihal', 'like', "%{$search}%");
            });
        }

        // Date range filter
        if ($tglMulai = $request->input('tanggal_mulai')) {
            $query->whereDate('tanggal_terima', '>=', $tglMulai);
        }
        if ($tglSelesai = $request->input('tanggal_selesai')) {
            $query->whereDate('tanggal_terima', '<=', $tglSelesai);
        }

        $suratMasuks = $query->paginate($perPage);

        return Inertia::render('SuratMasuk/Index', [
            'suratMasuks' => $suratMasuks,
            'filters' => $request->only(['search', 'tanggal_mulai', 'tanggal_selesai', 'per_page']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('SuratMasuk/Create', [
            'indeksOptions' => Indeks::where('is_active', true)->get(['id', 'kode', 'nama']),
        ]);
    }

    public function store(SuratMasukStoreRequest $request): RedirectResponse
    {
        $surat = $this->suratMasukService->create(
            $request->validated(),
            $request->file('file'),
            $request->user()->id
        );

        return redirect()
            ->route('surat-masuk.show', $surat)
            ->with('success', 'Surat masuk berhasil disimpan.');
    }

    public function show(SuratMasuk $suratMasuk): Response
    {
        $this->authorize('view', $suratMasuk);

        $suratMasuk->load(['indeks', 'unitPenerima', 'disposisis.dari', 'disposisis.kepada', 'createdBy']);

        return Inertia::render('SuratMasuk/Show', [
            'surat' => $suratMasuk,
        ]);
    }

    public function edit(SuratMasuk $suratMasuk): Response
    {
        $this->authorize('update', $suratMasuk);

        return Inertia::render('SuratMasuk/Edit', [
            'surat' => $suratMasuk,
            'indeksOptions' => Indeks::where('is_active', true)->get(['id', 'kode', 'nama']),
        ]);
    }

    public function update(SuratMasukUpdateRequest $request, SuratMasuk $suratMasuk): RedirectResponse
    {
        $this->suratMasukService->update(
            $suratMasuk,
            $request->validated(),
            $request->file('file'),
            $request->user()->id
        );

        return redirect()
            ->route('surat-masuk.show', $suratMasuk)
            ->with('success', 'Surat masuk berhasil diperbarui.');
    }

    public function destroy(SuratMasuk $suratMasuk): RedirectResponse
    {
        $this->authorize('delete', $suratMasuk);
        $this->suratMasukService->delete($suratMasuk);

        return redirect()
            ->route('surat-masuk.index')
            ->with('success', 'Surat masuk berhasil dihapus. Dapat direstore dalam 30 hari dari Trash.');
    }

    public function cetakDisposisi(SuratMasuk $suratMasuk)
    {
        $this->authorize('view', $suratMasuk);

        $pdf = $this->pdfGenerator->generateLembarDisposisi($suratMasuk);

        return $pdf->stream("lembar-disposisi-{$suratMasuk->nomor_surat}.pdf");
    }
}
```

### 7.2 SuratKeluarController (Excerpt — approval flow)

```php
<?php

namespace App\Http\Controllers;

use App\Enums\StatusSuratKeluarEnum;
use App\Http\Requests\SuratKeluarApprovalRequest;
use App\Http\Requests\SuratKeluarStoreRequest;
use App\Models\SuratKeluar;
use App\Notifications\SuratKeluarApprovedNotification;
use App\Notifications\SuratKeluarRejectedNotification;
use App\Services\PdfGeneratorService;
use App\Services\SuratKeluarService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SuratKeluarController extends Controller
{
    public function __construct(
        private readonly SuratKeluarService $suratKeluarService,
        private readonly PdfGeneratorService $pdfGenerator,
    ) {}

    public function store(SuratKeluarStoreRequest $request): RedirectResponse
    {
        $surat = $this->suratKeluarService->create($request->validated(), $request->user());

        return redirect()
            ->route('surat-keluar.show', $surat)
            ->with('success', 'Draft surat keluar berhasil dibuat. Submit untuk approval Rektor.');
    }

    public function submitForApproval(SuratKeluar $suratKeluar): RedirectResponse
    {
        $this->authorize('update', $suratKeluar);

        if ($suratKeluar->status !== StatusSuratKeluarEnum::DRAFT) {
            return back()->with('error', 'Hanya draft yang bisa disubmit.');
        }

        $suratKeluar->update(['status' => StatusSuratKeluarEnum::MENUNGGU_ACC]);

        // Notif ke semua superadmin (Rektor)
        \App\Models\User::where('role', \App\Enums\RoleEnum::SUPERADMIN)
            ->get()
            ->each(fn ($u) => $u->notify(new \App\Notifications\SuratKeluarMenungguAccNotification($suratKeluar)));

        return back()->with('success', 'Surat keluar disubmit. Menunggu approval Rektor.');
    }

    public function approve(SuratKeluarApprovalRequest $request, SuratKeluar $suratKeluar): RedirectResponse
    {
        $this->authorize('approve', $suratKeluar);

        $suratKeluar->update([
            'status' => StatusSuratKeluarEnum::DISETUJUI,
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        // Notif ke pengaju
        $suratKeluar->createdBy->notify(new SuratKeluarApprovedNotification($suratKeluar));

        return back()->with('success', 'Surat keluar disetujui.');
    }

    public function reject(SuratKeluarApprovalRequest $request, SuratKeluar $suratKeluar): RedirectResponse
    {
        $this->authorize('approve', $suratKeluar);

        $suratKeluar->update([
            'status' => StatusSuratKeluarEnum::DITOLAK,
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
            'rejection_reason' => $request->input('alasan_penolakan'),
        ]);

        $suratKeluar->createdBy->notify(new SuratKeluarRejectedNotification($suratKeluar));

        return back()->with('success', 'Surat keluar ditolak. Pengaju dapat merevisi.');
    }

    public function cetak(SuratKeluar $suratKeluar)
    {
        $this->authorize('view', $suratKeluar);

        if ($suratKeluar->status !== StatusSuratKeluarEnum::DISETUJUI) {
            abort(403, 'Surat belum disetujui.');
        }

        return $this->pdfGenerator->generateSuratKeluar($suratKeluar)->stream("surat-keluar-{$suratKeluar->nomor_surat}.pdf");
    }
}
```

---

## 8. Policies (Authorization)

### 8.1 SuratMasukPolicy

```php
<?php

namespace App\Policies;

use App\Enums\RoleEnum;
use App\Models\SuratMasuk;
use App\Models\User;

class SuratMasukPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isActive();
    }

    public function view(User $user, SuratMasuk $surat): bool
    {
        if ($user->hasRole(RoleEnum::SUPERADMIN) || $user->hasRole(RoleEnum::ADMIN_TU)) {
            return true;
        }
        return $surat->unit_penerima_id === $user->unit_id;
    }

    public function create(User $user): bool
    {
        return $user->isActive();
    }

    public function update(User $user, SuratMasuk $surat): bool
    {
        if (! $user->isActive()) return false;
        if ($user->hasRole(RoleEnum::SUPERADMIN) || $user->hasRole(RoleEnum::ADMIN_TU)) {
            return true;
        }
        return $surat->created_by === $user->id && $surat->unit_penerima_id === $user->unit_id;
    }

    public function delete(User $user, SuratMasuk $surat): bool
    {
        return $user->hasRole(RoleEnum::SUPERADMIN) || $user->hasRole(RoleEnum::ADMIN_TU);
    }

    public function restore(User $user, SuratMasuk $surat): bool
    {
        return $user->hasRole(RoleEnum::SUPERADMIN) || $user->hasRole(RoleEnum::ADMIN_TU);
    }
}
```

### 8.2 SuratKeluarPolicy

```php
<?php

namespace App\Policies;

use App\Enums\RoleEnum;
use App\Enums\StatusSuratKeluarEnum;
use App\Models\SuratKeluar;
use App\Models\User;

class SuratKeluarPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isActive();
    }

    public function view(User $user, SuratKeluar $surat): bool
    {
        if ($user->hasRole(RoleEnum::SUPERADMIN) || $user->hasRole(RoleEnum::ADMIN_TU)) {
            return true;
        }
        return $surat->unit_pembuat_id === $user->unit_id;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, [RoleEnum::SUPERADMIN, RoleEnum::ADMIN_TU, RoleEnum::KEPALA_UNIT]);
    }

    public function update(User $user, SuratKeluar $surat): bool
    {
        if (! $surat->isEditable()) return false;
        if ($user->hasRole(RoleEnum::SUPERADMIN) || $user->hasRole(RoleEnum::ADMIN_TU)) {
            return true;
        }
        return $surat->created_by === $user->id;
    }

    public function approve(User $user, SuratKeluar $surat): bool
    {
        return $user->hasRole(RoleEnum::SUPERADMIN) && $surat->isApprovable();
    }
}
```

---

## 9. Observers (Audit Trail)

### 9.1 SuratMasukObserver

```php
<?php

namespace App\Observers;

use App\Models\AuditLog;
use App\Models\SuratMasuk;

class SuratMasukObserver
{
    public function created(SuratMasuk $surat): void
    {
        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'created',
            'model_type' => SuratMasuk::class,
            'model_id' => $surat->id,
            'after' => $surat->toArray(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'created_at' => now(),
        ]);
    }

    public function updated(SuratMasuk $surat): void
    {
        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'updated',
            'model_type' => SuratMasuk::class,
            'model_id' => $surat->id,
            'before' => $surat->getOriginal(),
            'after' => $surat->getChanges(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'created_at' => now(),
        ]);
    }

    public function deleted(SuratMasuk $surat): void
    {
        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'deleted',
            'model_type' => SuratMasuk::class,
            'model_id' => $surat->id,
            'before' => $surat->toArray(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'created_at' => now(),
        ]);
    }
}
```

### 9.2 Register Observers (in AppServiceProvider)

```php
<?php

namespace App\Providers;

use App\Models\Disposisi;
use App\Models\Pelayanan;
use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use App\Models\User;
use App\Observers\DisposisiObserver;
use App\Observers\PelayananObserver;
use App\Observers\SuratKeluarObserver;
use App\Observers\SuratMasukObserver;
use App\Observers\UserObserver;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // HTTPS di production
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        // Register observers
        User::observe(UserObserver::class);
        SuratMasuk::observe(SuratMasukObserver::class);
        SuratKeluar::observe(SuratKeluarObserver::class);
        Disposisi::observe(DisposisiObserver::class);
        Pelayanan::observe(PelayananObserver::class);
    }
}
```

---

## 10. Middleware

### 10.1 EnsureUserActive

```php
<?php

namespace App\Http\Middleware;

use App\Enums\StatusUserEnum;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserActive
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->status !== StatusUserEnum::ACTIVE) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return redirect('/login')->with('error', 'Akun Anda belum aktif atau telah dinonaktifkan.');
        }
        return $next($request);
    }
}
```

### 10.2 SetActiveYear

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetActiveYear
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->session()->has('active_year')) {
            $request->session()->put('active_year', now()->year);
        }
        return $next($request);
    }
}
```

### 10.3 CheckRole

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();
        if (! $user || ! in_array($user->role->value, $roles)) {
            abort(403, 'Anda tidak memiliki akses ke halaman ini.');
        }
        return $next($request);
    }
}
```

### 10.4 Register di bootstrap/app.php

```php
<?php

use App\Http\Middleware\CheckRole;
use App\Http\Middleware\EnsureUserActive;
use App\Http\Middleware\SetActiveYear;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\SetActiveYear::class,
        ]);

        $middleware->alias([
            'active' => EnsureUserActive::class,
            'role' => CheckRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
```

---

## 11. Routes

### 11.1 routes/web.php

```php
<?php

use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\IndeksController;
use App\Http\Controllers\Admin\KodeSuratController;
use App\Http\Controllers\Admin\UnitController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DisposisiController;
use App\Http\Controllers\NotifikasiController;
use App\Http\Controllers\PelayananController;
use App\Http\Controllers\PelayananProgressController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RekapController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\SuratKeluarController;
use App\Http\Controllers\SuratMasukController;
use Illuminate\Support\Facades\Route;

// Guest routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);
    Route::get('/forgot-password', [PasswordResetLinkController::class, 'create'])->name('password.request');
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])->name('password.email');
    Route::get('/reset-password/{token}', [NewPasswordController::class, 'create'])->name('password.reset');
    Route::post('/reset-password', [NewPasswordController::class, 'store'])->name('password.store');
});

// Auth routes
Route::middleware(['auth', 'active'])->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');

    // Session: toggle tahun
    Route::post('/session/set-year', [SessionController::class, 'setYear'])->name('session.set-year');

    // Surat Masuk
    Route::resource('surat-masuk', SuratMasukController::class);
    Route::get('surat-masuk/{suratMasuk}/cetak-disposisi', [SuratMasukController::class, 'cetakDisposisi'])->name('surat-masuk.cetak-disposisi');
    Route::post('surat-masuk/{suratMasuk}/restore', [SuratMasukController::class, 'restore'])->name('surat-masuk.restore')->middleware('role:superadmin,admin_tu');

    // Surat Keluar
    Route::resource('surat-keluar', SuratKeluarController::class);
    Route::post('surat-keluar/{suratKeluar}/submit', [SuratKeluarController::class, 'submitForApproval'])->name('surat-keluar.submit');
    Route::post('surat-keluar/{suratKeluar}/approve', [SuratKeluarController::class, 'approve'])->name('surat-keluar.approve')->middleware('role:superadmin');
    Route::post('surat-keluar/{suratKeluar}/reject', [SuratKeluarController::class, 'reject'])->name('surat-keluar.reject')->middleware('role:superadmin');
    Route::get('surat-keluar/{suratKeluar}/cetak', [SuratKeluarController::class, 'cetak'])->name('surat-keluar.cetak');

    // Disposisi
    Route::resource('disposisi', DisposisiController::class)->only(['index', 'show', 'store']);

    // Rekap
    Route::get('/rekap', [RekapController::class, 'index'])->name('rekap.index');
    Route::get('/rekap/surat-masuk', [RekapController::class, 'suratMasuk'])->name('rekap.surat-masuk');
    Route::get('/rekap/surat-keluar', [RekapController::class, 'suratKeluar'])->name('rekap.surat-keluar');
    Route::get('/rekap/disposisi', [RekapController::class, 'disposisi'])->name('rekap.disposisi');
    Route::get('/rekap/export/{type}', [RekapController::class, 'export'])->name('rekap.export');

    // Pelayanan
    Route::resource('pelayanan', PelayananController::class);
    Route::post('pelayanan/{pelayanan}/progress', [PelayananProgressController::class, 'store'])->name('pelayanan.progress');

    // Notifikasi
    Route::get('/notifications', [NotifikasiController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/read', [NotifikasiController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [NotifikasiController::class, 'markAllAsRead'])->name('notifications.read-all');

    // Admin (superadmin only)
    Route::prefix('admin')->middleware('role:superadmin')->name('admin.')->group(function () {
        Route::resource('users', UserController::class);
        Route::post('users/{user}/approve', [UserController::class, 'approve'])->name('users.approve');
        Route::post('users/{user}/reject', [UserController::class, 'reject'])->name('users.reject');
        Route::get('users-pending', [UserController::class, 'pending'])->name('users.pending');

        Route::resource('units', UnitController::class);
        Route::resource('kode-surat', KodeSuratController::class);
        Route::resource('indeks', IndeksController::class);

        Route::get('audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');
        Route::get('audit-logs/{auditLog}', [AuditLogController::class, 'show'])->name('audit-logs.show');
    });
});
```

---

## 12. Notifications (Laravel Notifications)

### 12.1 DisposisiBaruNotification

```php
<?php

namespace App\Notifications;

use App\Models\Disposisi;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DisposisiBaruNotification extends Notification
{
    use Queueable;

    public function __construct(public Disposisi $disposisi) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail']; // In-app + email
    }

    public function toArray(object $notifiable): array
    {
        return [
            'disposisi_id' => $this->disposisi->id,
            'surat_masuk_id' => $this->disposisi->surat_masuk_id,
            'dari_user_name' => $this->disposisi->dari->name,
            'perihal' => $this->disposisi->suratMasuk->perihal,
            'isi' => $this->disposisi->isi,
            'type' => 'disposisi_baru',
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Disposisi Baru: {$this->disposisi->suratMasuk->perihal}")
            ->greeting("Halo {$notifiable->name},")
            ->line("Anda menerima disposisi baru dari {$this->disposisi->dari->name}:")
            ->line("\"{$this->disposisi->isi}\"")
            ->action('Lihat Surat', route('surat-masuk.show', $this->disposisi->surat_masuk_id))
            ->line('Terima kasih.');
    }
}
```

---

## 13. Database Seeders

### 13.1 DatabaseSeeder

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UnitSeeder::class,
            KodeSuratSeeder::class,
            IndeksSeeder::class,
            UserSeeder::class, // Superadmin default
        ]);
    }
}
```

### 13.2 UnitSeeder

```php
<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    public function run(): void
    {
        $units = [
            ['kode' => 'TUS', 'nama' => 'Tata Usaha', 'keterangan' => 'Unit administrasi umum'],
            ['kode' => 'IT', 'nama' => 'IT Rumah Sakit', 'keterangan' => 'Unit teknologi informasi'],
            ['kode' => 'PGI', 'nama' => 'Poli Gigi', 'keterangan' => 'Pelayanan poli gigi'],
            ['kode' => 'PBM', 'nama' => 'Poli Bedah Mulut', 'keterangan' => 'Pelayanan bedah mulut'],
            ['kode' => 'RAD', 'nama' => 'Radiologi', 'keterangan' => 'Unit radiologi gigi'],
            ['kode' => 'FAR', 'nama' => 'Farmasi', 'keterangan' => 'Unit farmasi'],
            ['kode' => 'LAB', 'nama' => 'Laboratorium', 'keterangan' => 'Unit laboratorium'],
            ['kode' => 'IGD', 'nama' => 'Instalasi Gawat Darurat', 'keterangan' => 'IGD RSGM'],
            ['kode' => 'RI', 'nama' => 'Rawat Inap', 'keterangan' => 'Unit rawat inap'],
            ['kode' => 'KEU', 'nama' => 'Keuangan', 'keterangan' => 'Unit keuangan'],
            ['kode' => 'PEM', 'nama' => 'Pemeliharaan', 'keterangan' => 'Unit pemeliharaan'],
            ['kode' => 'DOK', 'nama' => 'Rekam Medis', 'keterangan' => 'Unit rekam medis'],
        ];

        foreach ($units as $unit) {
            Unit::create($unit);
        }
    }
}
```

### 13.3 UserSeeder (default superadmin)

```php
<?php

namespace Database\Seeders;

use App\Enums\RoleEnum;
use App\Enums\StatusUserEnum;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $tu = Unit::where('kode', 'TUS')->first();

        User::create([
            'username' => 'superadmin',
            'name' => 'Superadmin RSGM',
            'email' => 'superadmin@rsgm-unimus.test',
            'password' => Hash::make('password'),
            'unit_id' => $tu->id,
            'role' => RoleEnum::SUPERADMIN,
            'status' => StatusUserEnum::ACTIVE,
        ]);
    }
}
```

### 13.4 IndeksSeeder

```php
<?php

namespace Database\Seeders;

use App\Models\Indeks;
use Illuminate\Database\Seeder;

class IndeksSeeder extends Seeder
{
    public function run(): void
    {
        $indeks = [
            ['kode' => 'B', 'nama' => 'Biasa', 'kode_turunan' => null],
            ['kode' => 'ST', 'nama' => 'Surat Tugas', 'kode_turunan' => ['KP', 'KM']],
            ['kode' => 'SK', 'nama' => 'Surat Keputusan', 'kode_turunan' => null],
            ['kode' => 'UND', 'nama' => 'Undangan', 'kode_turunan' => null],
            ['kode' => 'PEM', 'nama' => 'Pemberitahuan', 'kode_turunan' => null],
            ['kode' => 'NOTA', 'nama' => 'Nota Dinas', 'kode_turunan' => null],
            ['kode' => 'PENG', 'nama' => 'Pengumuman', 'kode_turunan' => null],
            ['kode' => 'LAP', 'nama' => 'Laporan', 'kode_turunan' => null],
            ['kode' => 'EDAR', 'nama' => 'Surat Edaran', 'kode_turunan' => null],
            ['kode' => 'REK', 'nama' => 'Surat Rekomendasi', 'kode_turunan' => null],
        ];

        foreach ($indeks as $i) {
            Indeks::create($i);
        }
    }
}
```

---

## 14. Testing (Pest 3)

### 14.1 tests/Pest.php (Setup)

```php
<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class)->in('Feature');
uses(TestCase::class)->in('Unit');
```

### 14.2 Feature Test Example: SuratMasuk

```php
<?php

use App\Models\SuratMasuk;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

it('can create surat masuk', function () {
    Storage::fake('local');
    $user = User::factory()->create();
    $unit = Unit::factory()->create();

    $file = UploadedFile::fake()->create('surat.pdf', 100, 'application/pdf');

    $response = $this->actingAs($user)->post('/surat-masuk', [
        'tanggal_terima' => '2026-08-27',
        'tanggal_surat' => '2026-08-26',
        'nomor_surat' => '001/UNIV/VIII/2026',
        'pengirim' => 'Rektor UNIMUS',
        'perihal' => 'Undangan Rapat',
        'unit_penerima_id' => $unit->id,
        'file' => $file,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('surat_masuks', [
        'nomor_surat' => '001/UNIV/VIII/2026',
        'created_by' => $user->id,
    ]);
});

it('validates tanggal_surat before tanggal_terima', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/surat-masuk', [
        'tanggal_terima' => '2026-08-27',
        'tanggal_surat' => '2026-08-28', // Invalid: setelah tanggal terima
        'nomor_surat' => '001',
        'pengirim' => 'Test',
        'perihal' => 'Test',
    ]);

    $response->assertSessionHasErrors('tanggal_surat');
});

it('requires file upload', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/surat-masuk', [
        'tanggal_terima' => '2026-08-27',
        'tanggal_surat' => '2026-08-26',
        'nomor_surat' => '001',
        'pengirim' => 'Test',
        'perihal' => 'Test',
        // No file
    ]);

    $response->assertSessionHasErrors('file');
});
```

### 14.3 Unit Test Example: NomorSuratGenerator

```php
<?php

use App\Models\Indeks;
use App\Models\KodeSurat;
use App\Models\Unit;
use App\Services\NomorSuratGenerator;

it('generates correct format with bulan romawi', function () {
    $kode = KodeSurat::create(['kode' => 'UNIMUS']);
    $unit = Unit::create(['kode' => 'IT', 'nama' => 'IT']);
    $indeks = Indeks::create(['kode' => 'ST', 'nama' => 'Surat Tugas', 'kode_turunan' => ['KP']]);

    Carbon\Carbon::setTestNow('2026-08-15');

    $generator = new NomorSuratGenerator();
    $nomor = $generator->generate($kode->id, $unit->id, $indeks->id, 'KP');

    expect($nomor)->toBe('UNIMUS/IT/ST.KP/001/VIII/2026');
});
```

---

## 15. Scheduled Tasks (Cron)

### 15.1 Console Kernel — di routes/console.php

```php
<?php

use Illuminate\Support\Facades\Schedule;

// Purge surat yang di-trash lebih dari 30 hari (jalankan harian jam 03:00)
Schedule::call(function () {
    app(\App\Services\SuratMasukService::class)->purgeOldTrashed();
    app(\App\Services\SuratKeluarService::class)->purgeOldTrashed();
})->dailyAt('03:00')->name('purge-old-trashed');

// Cleanup notifikasi lama (90 hari)
Schedule::call(function () {
    \DB::table('notifications')->where('created_at', '<', now()->subDays(90))->delete();
})->weekly()->name('cleanup-notifications');
```

---

## 16. Error Handling

### 16.1 Custom Exception Handler (bootstrap/app.php)

```php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, $request) {
        if ($request->expectsJson()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }
        return redirect()->route('login');
    });

    $exceptions->render(function (\Illuminate\Auth\Access\AuthorizationException $e, $request) {
        if ($request->expectsJson()) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }
        return inertia('Errors/403', ['message' => 'Anda tidak memiliki akses.'])
            ->toResponse($request)
            ->setStatusCode(403);
    });

    $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e, $request) {
        if ($request->expectsJson()) {
            return response()->json(['message' => 'Not found.'], 404);
        }
        return inertia('Errors/404')->toResponse($request)->setStatusCode(404);
    });
})
```

---

## 17. Penutup & Referensi Cepat

### 17.1 Cheat Sheet Harian

**Buat resource baru (CRUD):**
1. `php artisan make:model NamaModel -mf` (model + migration + factory)
2. `php artisan make:controller NamaController --resource` (resource controller)
3. `php artisan make:request NamaStoreRequest` (FormRequest)
4. Tulis di `app/Services/NamaService.php` (business logic)
5. Tulis Policy di `app/Policies/NamaPolicy.php`
6. Tulis Observer di `app/Observers/NamaObserver.php`
7. Register route di `routes/web.php`
8. Register observer di `AppServiceProvider::boot()`
9. Tulis test di `tests/Feature/`

**Format controller method:**
```php
public function store(StoreRequest $request): RedirectResponse
{
    $this->authorize('create', Model::class);
    $data = $this->service->create($request->validated(), $request->user());
    return redirect()->route('model.show', $data)->with('success', 'Berhasil.');
}
```

### 17.2 Yang **TIDAK** Boleh Dilakukan

- ❌ Business logic di controller.
- ❌ Validasi inline di controller.
- ❌ Pakai `DB::` raw (pakai Eloquent).
- ❌ N+1 query (selalu `with()` relasi).
- ❌ Pakai `any` type (PHP 8 strict).
- ❌ Pakai `env()` di luar config files.
- ❌ Hardcode role/permission string di banyak tempat (pakai Enum).
- ❌ Skip authorization check di controller.
- ❌ Return response langsung dari service.

### 17.3 Yang **HARUS** Dilakukan

- ✅ Constructor property promotion untuk DI.
- ✅ Explicit return types di semua method.
- ✅ PHPDoc untuk public methods.
- ✅ `authorize()` di setiap controller method.
- ✅ Eager loading relasi.
- ✅ Form Request untuk semua validasi.
- ✅ Service layer untuk business logic.
- ✅ Test untuk critical flows.
- ✅ Run `vendor/bin/pint --dirty` sebelum commit.

---

**Dokumen ini adalah panduan wajib untuk backend Laravel. Update sesuai konvensi terbaru Laravel 12.**
