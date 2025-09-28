<?php
use PHPUnit\Framework\TestCase;
use Wits\Services\MovementService;

final class EnsureOutRuleTest extends TestCase
{
    public function test_out_cannot_exceed_stock(): void
    {
        $this->expectException(\DomainException::class);
        MovementService::ensureOutAllowed(10, 11);
    }

    public function test_out_equal_or_below_stock_is_ok(): void
    {
        MovementService::ensureOutAllowed(10, 10);
        $this->assertTrue(true);
    }

    public function test_quantity_must_be_positive(): void
    {
        $this->expectException(\DomainException::class);
        MovementService::ensureOutAllowed(10, 0);
    }
}
