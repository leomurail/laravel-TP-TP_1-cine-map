<?php

use App\Mcp\Servers\CineMapServer;
use Laravel\Mcp\Facades\Mcp;

// Mcp::web('/mcp/demo', \App\Mcp\Servers\PublicServer::class);
Mcp::local('cinemap', CineMapServer::class);
