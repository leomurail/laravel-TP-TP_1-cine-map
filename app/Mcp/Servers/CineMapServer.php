<?php

namespace App\Mcp\Servers;

use App\Mcp\Tools\GetLocationsForFilmTool;
use App\Mcp\Tools\ListFilmsTool;
use Laravel\Mcp\Server;
use Laravel\Mcp\Server\Attributes\Instructions;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Attributes\Version;

#[Name('Cine Map Server')]
#[Version('0.0.1')]
#[Instructions('Instructions describing how to use the server and its features.')]
class CineMapServer extends Server
{
    protected array $tools = [
        ListFilmsTool::class,
        GetLocationsForFilmTool::class,
    ];

    protected array $resources = [
        //
    ];

    protected array $prompts = [
        //
    ];
}
